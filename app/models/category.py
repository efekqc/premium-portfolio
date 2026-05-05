from __future__ import annotations

from typing import Optional, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin

if TYPE_CHECKING:
    from app.models.image import Image


class Category(Base, UUIDPKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "categories"

    slug: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    cover_image_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("images.id", ondelete="SET NULL")
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    images: Mapped[list["Image"]] = relationship(
        back_populates="category", foreign_keys="Image.category_id"
    )
    cover_image: Mapped["Image | None"] = relationship(foreign_keys=[cover_image_id])
