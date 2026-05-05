from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import CITEXT, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin
from app.models.enums import ImageSource, ImageStatus

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.tag import Tag
    from app.models.variant import ImageVariant


class Image(Base, UUIDPKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "images"

    slug: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    alt_text: Mapped[str] = mapped_column(String(500), nullable=False)

    category_id: Mapped[UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    status: Mapped[ImageStatus] = mapped_column(
        SAEnum(
            ImageStatus,
            name="image_status",
            values_callable=lambda e: [m.value for m in e],
        ),
        default=ImageStatus.DRAFT,
        nullable=False,
    )
    source: Mapped[ImageSource] = mapped_column(
        SAEnum(
            ImageSource,
            name="image_source",
            values_callable=lambda e: [m.value for m in e],
        ),
        default=ImageSource.ORIGINAL,
        nullable=False,
    )

    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(80), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    width_px: Mapped[int] = mapped_column(Integer, nullable=False)
    height_px: Mapped[int] = mapped_column(Integer, nullable=False)
    aspect_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(6, 4))  # generated column

    blur_hash: Mapped[Optional[str]] = mapped_column(String(64))
    dominant_color: Mapped[Optional[str]] = mapped_column(String(7))

    exif_data: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    ai_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    view_count: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)

    captured_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    category: Mapped["Category"] = relationship(
        back_populates="images",
        foreign_keys=[category_id],
        lazy="joined",
    )
    tags: Mapped[list["Tag"]] = relationship(
        secondary="image_tags", back_populates="images", lazy="selectin"
    )
    variants: Mapped[list["ImageVariant"]] = relationship(
        back_populates="image", cascade="all, delete-orphan", lazy="selectin"
    )

    __table_args__ = (
        CheckConstraint("file_size_bytes > 0", name="ck_images_filesize_positive"),
        CheckConstraint("width_px > 0", name="ck_images_width_positive"),
        CheckConstraint("height_px > 0", name="ck_images_height_positive"),
    )
