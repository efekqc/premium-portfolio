from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryDetail, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


def _parse_lookup(value: str) -> tuple[UUID | None, str | None]:
    try:
        return UUID(value), None
    except ValueError:
        return None, value


async def _get_category_or_404(db: AsyncSession, lookup: str) -> Category:
    cat_id, slug = _parse_lookup(lookup)
    stmt = select(Category).where(Category.deleted_at.is_(None))
    stmt = stmt.where(Category.id == cat_id) if cat_id else stmt.where(Category.slug == slug)
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if obj is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found.")
    return obj


@router.get("", response_model=list[CategoryDetail])
async def list_categories(
    featured_only: bool = Query(False),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> list[Category]:
    stmt = (
        select(Category)
        .where(Category.deleted_at.is_(None))
        .order_by(Category.sort_order.asc(), Category.name.asc())
        .limit(limit)
        .offset(offset)
    )
    if featured_only:
        stmt = stmt.where(Category.is_featured.is_(True))
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{lookup}", response_model=CategoryDetail)
async def get_category(
    lookup: str,
    db: AsyncSession = Depends(get_db),
) -> Category:
    return await _get_category_or_404(db, lookup)


@router.post(
    "",
    response_model=CategoryDetail,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> Category:
    obj = Category(**payload.model_dump())
    db.add(obj)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already in use.") from exc
    await db.refresh(obj)
    return obj


@router.patch(
    "/{category_id}",
    response_model=CategoryDetail,
    dependencies=[Depends(require_admin)],
)
async def update_category(
    category_id: UUID,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> Category:
    obj = await _get_category_or_404(db, str(category_id))
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_category(
    category_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    obj = await _get_category_or_404(db, str(category_id))
    obj.deleted_at = func.now()
    await db.commit()
