from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagDetail, TagUpdate

router = APIRouter(prefix="/tags", tags=["tags"])


def _parse_lookup(value: str) -> tuple[UUID | None, str | None]:
    try:
        return UUID(value), None
    except ValueError:
        return None, value


async def _get_tag_or_404(db: AsyncSession, lookup: str) -> Tag:
    tag_id, slug = _parse_lookup(lookup)
    stmt = select(Tag)
    stmt = stmt.where(Tag.id == tag_id) if tag_id else stmt.where(Tag.slug == slug)
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if obj is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tag not found.")
    return obj


@router.get("", response_model=list[TagDetail])
async def list_tags(
    search: str | None = Query(None, description="Fuzzy match on tag name."),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> list[Tag]:
    stmt = (
        select(Tag)
        .order_by(Tag.usage_count.desc(), Tag.name.asc())
        .limit(limit)
        .offset(offset)
    )
    if search:
        stmt = stmt.where(Tag.name.ilike(f"%{search}%"))
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{lookup}", response_model=TagDetail)
async def get_tag(
    lookup: str,
    db: AsyncSession = Depends(get_db),
) -> Tag:
    return await _get_tag_or_404(db, lookup)


@router.post(
    "",
    response_model=TagDetail,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_tag(
    payload: TagCreate,
    db: AsyncSession = Depends(get_db),
) -> Tag:
    obj = Tag(**payload.model_dump())
    db.add(obj)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Slug already in use.") from exc
    await db.refresh(obj)
    return obj


@router.patch(
    "/{tag_id}",
    response_model=TagDetail,
    dependencies=[Depends(require_admin)],
)
async def update_tag(
    tag_id: UUID,
    payload: TagUpdate,
    db: AsyncSession = Depends(get_db),
) -> Tag:
    obj = await _get_tag_or_404(db, str(tag_id))
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete(
    "/{tag_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_tag(
    tag_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    obj = await _get_tag_or_404(db, str(tag_id))
    await db.delete(obj)
    await db.commit()
