from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

SLUG_PATTERN = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    sort_order: int = 0
    is_featured: bool = False


class CategoryCreate(CategoryBase):
    slug: str = Field(min_length=1, max_length=120, pattern=SLUG_PATTERN)
    cover_image_id: UUID | None = None


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    sort_order: int | None = None
    is_featured: bool | None = None
    cover_image_id: UUID | None = None


class CategoryDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    description: str | None
    cover_image_id: UUID | None
    sort_order: int
    is_featured: bool
    created_at: datetime
    updated_at: datetime
