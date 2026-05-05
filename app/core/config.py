from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- App ----
    app_name: str = "Portfolio API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    # ---- Database (async DSN: postgresql+asyncpg://...) ----
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio",
        description="Async SQLAlchemy DSN (must use asyncpg driver).",
    )
    db_echo: bool = False
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_use_ssl: bool = False  # Set true for Neon/cloud DBs; asyncpg needs connect_args not sslmode URL param

    # ---- Auth (single admin via env) ----
    admin_token: str = Field(
        default="change-me",
        description="Static bearer token for admin write operations.",
    )

    # ---- CORS ----
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])


@lru_cache
def get_settings() -> Settings:
    return Settings()
