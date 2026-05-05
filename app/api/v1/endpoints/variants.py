from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.image import Image
from app.models.variant import ImageVariant
from app.schemas.variant import VariantCreate, VariantDetail

router = APIRouter(tags=["variants"])


async def _ensure_image_exists(db: AsyncSession, image_id: UUID) -> Image:
    result = await db.execute(
        select(Image).where(Image.id == image_id, Image.deleted_at.is_(None))
    )
    image = result.scalar_one_or_none()
    if image is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Image not found.")
    return image


@router.get(
    "/images/{image_id}/variants",
    response_model=list[VariantDetail],
)
async def list_variants(
    image_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> list[ImageVariant]:
    await _ensure_image_exists(db, image_id)
    result = await db.execute(
        select(ImageVariant)
        .where(ImageVariant.image_id == image_id)
        .order_by(ImageVariant.size.asc(), ImageVariant.format.asc())
    )
    return list(result.scalars().all())


@router.post(
    "/images/{image_id}/variants",
    response_model=VariantDetail,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_variant(
    image_id: UUID,
    payload: VariantCreate,
    db: AsyncSession = Depends(get_db),
) -> ImageVariant:
    await _ensure_image_exists(db, image_id)
    variant = ImageVariant(image_id=image_id, **payload.model_dump())
    db.add(variant)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "A variant with this (size, format) already exists for this image.",
        ) from exc
    await db.refresh(variant)
    return variant


@router.delete(
    "/variants/{variant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_variant(
    variant_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    result = await db.execute(select(ImageVariant).where(ImageVariant.id == variant_id))
    variant = result.scalar_one_or_none()
    if variant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Variant not found.")
    await db.delete(variant)
    await db.commit()
