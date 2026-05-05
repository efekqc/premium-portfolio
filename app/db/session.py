from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

_settings = get_settings()

_connect_args: dict = {}
if _settings.db_use_ssl:
    # asyncpg requires ssl via connect_args, not as a URL query param.
    # Neon (and most cloud Postgres providers) mandate SSL.
    import ssl as _ssl
    _ssl_ctx = _ssl.create_default_context()
    _connect_args = {"ssl": _ssl_ctx}

engine: AsyncEngine = create_async_engine(
    _settings.database_url,
    echo=_settings.db_echo,
    pool_size=_settings.db_pool_size,
    max_overflow=_settings.db_max_overflow,
    pool_pre_ping=True,
    future=True,
    connect_args=_connect_args,
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an AsyncSession and ensures
    rollback-on-error / close-always semantics.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
