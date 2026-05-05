from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import VariantFormat, VariantSize


class VariantCreate(BaseModel):
    size: VariantSize
    format: VariantFormat
    storage_key: str = Field(min_length=1, max_length=500)
    width_px: int = Field(gt=0)
    height_px: int = Field(gt=0)
    file_size_bytes: int = Field(gt=0)


class VariantDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    image_id: UUID
    size: VariantSize
    format: VariantFormat
    storage_key: str
    width_px: int
    height_px: int
    file_size_bytes: int
