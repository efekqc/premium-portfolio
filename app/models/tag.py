from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table, func
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, UUIDPKMixin

if TYPE_CHECKING:
    from app.models.image import Image


# Junction table — defined as Table because it's pure M2M with no extra logic
image_tags = Table(
    "image_tags",
    Base.metadata,
    Column(
        "image_id",
        PG_UUID(as_uuid=True),
        ForeignKey("images.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        PG_UUID(as_uuid=True),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "created_at",
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    ),
)


class Tag(Base, UUIDPKMixin):
    __tablename__ = "tags"

    slug: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    color_hex: Mapped[Optional[str]] = mapped_column(String(7))
    usage_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    images: Mapped[list["Image"]] = relationship(
        secondary=image_tags, back_populates="tags"
    )
