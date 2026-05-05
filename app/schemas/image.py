from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ImageSource, ImageStatus, VariantFormat, VariantSize


# ---------- Tag ----------
class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    color_hex: str | None = None


# ---------- Category ----------
class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    description: str | None = None


# ---------- Variant ----------
class VariantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    size: VariantSize
    format: VariantFormat
    storage_key: str
    width_px: int
    height_px: int


# ---------- Image ----------
class ImageBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    alt_text: str = Field(min_length=1, max_length=500)
    caption: str | None = None
    description: str | None = None
    status: ImageStatus = ImageStatus.DRAFT
    source: ImageSource = ImageSource.ORIGINAL
    is_featured: bool = False
    sort_order: int = 0


class ImageCreate(ImageBase):
    slug: str = Field(
        min_length=1,
        max_length=200,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )
    category_id: UUID
    tag_ids: list[UUID] = Field(default_factory=list)
    storage_key: str
    mime_type: str
    file_size_bytes: int = Field(gt=0)
    width_px: int = Field(gt=0)
    height_px: int = Field(gt=0)
    blur_hash: str | None = None
    dominant_color: str | None = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")
    exif_data: dict[str, Any] = Field(default_factory=dict)
    ai_metadata: dict[str, Any] = Field(default_factory=dict)
    captured_at: datetime | None = None


class ImageUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    alt_text: str | None = Field(default=None, min_length=1, max_length=500)
    caption: str | None = None
    description: str | None = None
    category_id: UUID | None = None
    tag_ids: list[UUID] | None = None
    status: ImageStatus | None = None
    is_featured: bool | None = None
    sort_order: int | None = None


class ImageRead(ImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    category: CategoryRead
    tags: list[TagRead]
    variants: list[VariantRead]

    storage_key: str
    mime_type: str
    file_size_bytes: int
    width_px: int
    height_px: int
    aspect_ratio: Decimal | None
    blur_hash: str | None
    dominant_color: str | None
    exif_data: dict[str, Any]
    ai_metadata: dict[str, Any]

    view_count: int
    captured_at: datetime | None
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ImageList(BaseModel):
    """Paginated list response."""

    items: list[ImageRead]
    total: int
    page: int
    page_size: int
    has_next: bool
