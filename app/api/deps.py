"""Centralised FastAPI dependencies."""

from app.core.security import require_admin
from app.db.session import get_db

__all__ = ["get_db", "require_admin"]
