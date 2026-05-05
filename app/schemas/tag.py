from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

SLUG_PATTERN = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"
HEX_PATTERN = r"^#[0-9A-Fa-f]{6}$"


class TagCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=80, pattern=SLUG_PATTERN)
    name: str = Field(min_length=1, max_length=80)
    color_hex: str | None = Field(default=None, pattern=HEX_PATTERN)


class TagUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    color_hex: str | None = Field(default=None, pattern=HEX_PATTERN)


class TagDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    color_hex: str | None
    usage_count: int
    created_at: datetime
