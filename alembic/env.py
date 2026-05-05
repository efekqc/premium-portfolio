"""Async Alembic environment.

- Pulls the database URL from `app.core.config.Settings` so a single source of
  truth (the project's `.env`) governs both runtime and migrations.
- Imports `app.models` so that `Base.metadata` is fully populated; this is
  needed for autogenerate and harmless when running raw-SQL migrations.
"""

from __future__ import annotations

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# --- Project imports ---------------------------------------------------------
from app.core.config import get_settings
from app.db.base import Base  # noqa: F401  (Base.metadata is the target)
import app.models  # noqa: F401  (registers all mapped classes on Base.metadata)

# -----------------------------------------------------------------------------

config = context.config

# Inject DSN from settings, overriding any (intentionally blank) value in alembic.ini.
settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Render migration SQL to stdout without a live DB connection."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations against an async engine (asyncpg)."""
    connect_args: dict = {}
    if settings.db_use_ssl:
        import ssl as _ssl
        connect_args = {"ssl": _ssl.create_default_context()}

    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
        connect_args=connect_args,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
