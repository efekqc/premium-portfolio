from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, require_admin
from app.models.enums import ImageSource, ImageStatus
from app.models.image import Image
from app.models.tag import Tag
from app.schemas.image import ImageCreate, ImageList, ImageRead, ImageUpdate

router = APIRouter(prefix="/images", tags=["images"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _parse_lookup(value: str) -> tuple[UUID | None, str | None]:
    try:
        return UUID(value), None
    except ValueError:
        return None, value


def _base_select():
    """SELECT with eager loads + soft-delete filter."""
    return (
        select(Image)
        .where(Image.deleted_at.is_(None))
        .options(
            selectinload(Image.tags),
            selectinload(Image.variants),
            selectinload(Image.category),
        )
    )


async def _get_image_or_404(db: AsyncSession, lookup: str) -> Image:
    image_id, slug = _parse_lookup(lookup)
    stmt = _base_select()
    stmt = stmt.where(Image.id == image_id) if image_id else stmt.where(Image.slug == slug)
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if obj is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Image not found.")
    return obj


async def _resolve_tags(db: AsyncSession, tag_ids: list[UUID]) -> list[Tag]:
    if not tag_ids:
        return []
    result = await db.execute(select(Tag).where(Tag.id.in_(tag_ids)))
    tags = list(result.scalars().all())
    if len(tags) != len(set(tag_ids)):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "One or more tag_ids are invalid.")
    return tags


# ---------------------------------------------------------------------------
# Read
# ---------------------------------------------------------------------------
@router.get("", response_model=ImageList)
async def list_images(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    status_filter: ImageStatus | None = Query(None, alias="status"),
    source: ImageSource | None = None,
    category_id: UUID | None = None,
    category_slug: str | None = None,
    tag_slug: str | None = None,
    is_featured: bool | None = None,
    search: str | None = Query(None, description="Fuzzy title search."),
) -> ImageList:
    stmt = _base_select()

    if status_filter is not None:
        stmt = stmt.where(Image.status == status_filter)
    if source is not None:
        stmt = stmt.where(Image.source == source)
    if category_id is not None:
        stmt = stmt.where(Image.category_id == category_id)
    if category_slug is not None:
        # Use a join via the relationship's foreign key
        from app.models.category import Category

        stmt = stmt.join(Category, Image.category_id == Category.id).where(
            Category.slug == category_slug, Category.deleted_at.is_(None)
        )
    if tag_slug is not None:
        stmt = stmt.where(Image.tags.any(Tag.slug == tag_slug))
    if is_featured is not None:
        stmt = stmt.where(Image.is_featured.is_(is_featured))
    if search:
        stmt = stmt.where(Image.title.ilike(f"%{search}%"))

    # Total count (apply same filters, but drop eager loads)
    count_stmt = select(func.count()).select_from(stmt.order_by(None).subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    # Page slice
    stmt = (
        stmt.order_by(
            Image.is_featured.desc(),
            Image.sort_order.asc(),
            Image.published_at.desc().nulls_last(),
            Image.created_at.desc(),
        )
        .limit(page_size)
        .offset((page - 1) * page_size)
    )
    result = await db.execute(stmt)
    items = list(result.scalars().unique().all())

    return ImageList(
        items=[ImageRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get("/{lookup}", response_model=ImageRead)
async def get_image(
    lookup: str,
    db: AsyncSession = Depends(get_db),
) -> Image:
    image = await _get_image_or_404(db, lookup)

    # Atomic view-count increment (avoids read-modify-write races).
    await db.execute(
        update(Image).where(Image.id == image.id).values(view_count=Image.view_count + 1)
    )
    await db.commit()
    image.view_count += 1  # reflect in the response without a re-fetch
    return image


# ---------------------------------------------------------------------------
# Write (admin)
# ---------------------------------------------------------------------------
@router.post(
    "",
    response_model=ImageRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_image(
    payload: ImageCreate,
    db: AsyncSession = Depends(get_db),
) -> Image:
    data = payload.model_dump(exclude={"tag_ids"})
    image = Image(**data)

    if payload.tag_ids:
        image.tags = await _resolve_tags(db, payload.tag_ids)

    # Auto-set published_at on first publish
    if image.status == ImageStatus.PUBLISHED and image.published_at is None:
        image.published_at = func.now()

    db.add(image)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Slug already in use or category does not exist.",
        ) from exc

    # Re-fetch with eager loads so ImageRead has all relationships populated.
    return await _get_image_or_404(db, str(image.id))


@router.patch(
    "/{image_id}",
    response_model=ImageRead,
    dependencies=[Depends(require_admin)],
)
async def update_image(
    image_id: UUID,
    payload: ImageUpdate,
    db: AsyncSession = Depends(get_db),
) -> Image:
    image = await _get_image_or_404(db, str(image_id))

    update_data = payload.model_dump(exclude_unset=True)
    tag_ids = update_data.pop("tag_ids", None)

    for key, value in update_data.items():
        setattr(image, key, value)

    # First-publish timestamp
    if (
        "status" in update_data
        and image.status == ImageStatus.PUBLISHED
        and image.published_at is None
    ):
        image.published_at = func.now()

    if tag_ids is not None:
        image.tags = await _resolve_tags(db, tag_ids)

    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Update violates a constraint.") from exc

    return await _get_image_or_404(db, str(image.id))


@router.delete(
    "/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_image(
    image_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    image = await _get_image_or_404(db, str(image_id))
    image.deleted_at = func.now()
    await db.commit()
