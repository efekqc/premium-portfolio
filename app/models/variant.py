from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, UUIDPKMixin
from app.models.enums import VariantFormat, VariantSize

if TYPE_CHECKING:
    from app.models.image import Image


class ImageVariant(Base, UUIDPKMixin):
    __tablename__ = "image_variants"

    image_id: Mapped[UUID] = mapped_column(
        ForeignKey("images.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    size: Mapped[VariantSize] = mapped_column(
        SAEnum(VariantSize, name="variant_size"), nullable=False
    )
    format: Mapped[VariantFormat] = mapped_column(
        SAEnum(VariantFormat, name="variant_format"), nullable=False
    )

    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    width_px: Mapped[int] = mapped_column(Integer, nullable=False)
    height_px: Mapped[int] = mapped_column(Integer, nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)

    image: Mapped["Image"] = relationship(back_populates="variants")

    __table_args__ = (
        UniqueConstraint("image_id", "size", "format", name="uq_variant_image_size_format"),
        CheckConstraint("width_px > 0", name="ck_variants_width_positive"),
        CheckConstraint("height_px > 0", name="ck_variants_height_positive"),
        CheckConstraint("file_size_bytes > 0", name="ck_variants_filesize_positive"),
    )
