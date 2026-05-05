"""initial schema

Hand-written migration that emits the literal Step-1 PostgreSQL DDL.
Autogenerate is *not* used here because the schema relies on features that
Alembic's diff engine cannot reliably detect or roundtrip:

  * `pg_trgm`, `citext`, `uuid-ossp` extensions
  * Native PostgreSQL ENUM types
  * Partial indexes (`WHERE ...`)
  * GIN indexes with `gin_trgm_ops` / `jsonb_path_ops` opclasses
  * `aspect_ratio` GENERATED ALWAYS AS ... STORED column
  * Cyclic FK between `categories.cover_image_id` and `images.id`
  * Trigger functions for `updated_at` and `tags.usage_count`

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-05-05 12:30:00 UTC
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# =============================================================================
# UPGRADE
# =============================================================================
def upgrade() -> None:
    # -------------------------------------------------------------------------
    # Extensions
    # -------------------------------------------------------------------------
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "citext"')

    # -------------------------------------------------------------------------
    # Enum types
    # -------------------------------------------------------------------------
    op.execute("CREATE TYPE image_status   AS ENUM ('draft', 'published', 'archived')")
    op.execute("CREATE TYPE image_source   AS ENUM ('original', 'synthetic', 'mixed')")
    op.execute("CREATE TYPE variant_format AS ENUM ('jpeg', 'webp', 'avif', 'png')")
    op.execute("CREATE TYPE variant_size   AS ENUM ('thumbnail', 'small', 'medium', 'large', 'original')")

    # -------------------------------------------------------------------------
    # categories
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE categories (
            id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            slug            CITEXT NOT NULL UNIQUE,
            name            VARCHAR(120) NOT NULL,
            description     TEXT,
            cover_image_id  UUID,
            sort_order      INTEGER NOT NULL DEFAULT 0,
            is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            deleted_at      TIMESTAMPTZ
        )
        """
    )
    op.execute(
        "CREATE INDEX idx_categories_sort ON categories (sort_order) "
        "WHERE deleted_at IS NULL"
    )
    op.execute(
        "CREATE INDEX idx_categories_featured ON categories (is_featured) "
        "WHERE deleted_at IS NULL AND is_featured = TRUE"
    )

    # -------------------------------------------------------------------------
    # tags
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE tags (
            id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            slug        CITEXT NOT NULL UNIQUE,
            name        VARCHAR(80)  NOT NULL,
            color_hex   CHAR(7),
            usage_count INTEGER NOT NULL DEFAULT 0,
            created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute("CREATE INDEX idx_tags_usage_count ON tags (usage_count DESC)")
    op.execute("CREATE INDEX idx_tags_name_trgm   ON tags USING GIN (name gin_trgm_ops)")

    # -------------------------------------------------------------------------
    # images
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE images (
            id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            slug            CITEXT NOT NULL UNIQUE,
            title           VARCHAR(200) NOT NULL,
            caption         TEXT,
            description     TEXT,
            alt_text        VARCHAR(500) NOT NULL,

            category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

            status          image_status NOT NULL DEFAULT 'draft',
            source          image_source NOT NULL DEFAULT 'original',

            storage_key     VARCHAR(500) NOT NULL,
            mime_type       VARCHAR(80)  NOT NULL,
            file_size_bytes BIGINT       NOT NULL CHECK (file_size_bytes > 0),
            width_px        INTEGER      NOT NULL CHECK (width_px > 0),
            height_px       INTEGER      NOT NULL CHECK (height_px > 0),
            aspect_ratio    NUMERIC(6,4) GENERATED ALWAYS AS (width_px::NUMERIC / height_px) STORED,

            blur_hash       VARCHAR(64),
            dominant_color  CHAR(7),

            exif_data       JSONB NOT NULL DEFAULT '{}'::JSONB,
            ai_metadata     JSONB NOT NULL DEFAULT '{}'::JSONB,

            is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
            sort_order      INTEGER NOT NULL DEFAULT 0,
            view_count      BIGINT  NOT NULL DEFAULT 0,

            captured_at     TIMESTAMPTZ,
            published_at    TIMESTAMPTZ,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            deleted_at      TIMESTAMPTZ
        )
        """
    )

    # Cyclic FK: categories.cover_image_id -> images.id
    op.execute(
        """
        ALTER TABLE categories
            ADD CONSTRAINT fk_categories_cover_image
            FOREIGN KEY (cover_image_id) REFERENCES images(id) ON DELETE SET NULL
        """
    )

    # Hot-path indexes
    op.execute(
        "CREATE INDEX idx_images_category ON images (category_id) "
        "WHERE deleted_at IS NULL"
    )
    op.execute(
        "CREATE INDEX idx_images_status_pub ON images (status, published_at DESC) "
        "WHERE deleted_at IS NULL"
    )
    op.execute(
        "CREATE INDEX idx_images_featured ON images (is_featured, sort_order) "
        "WHERE deleted_at IS NULL AND is_featured = TRUE"
    )
    op.execute(
        "CREATE INDEX idx_images_published_at ON images (published_at DESC) "
        "WHERE deleted_at IS NULL AND status = 'published'"
    )
    op.execute("CREATE INDEX idx_images_title_trgm ON images USING GIN (title gin_trgm_ops)")
    op.execute("CREATE INDEX idx_images_exif_gin  ON images USING GIN (exif_data jsonb_path_ops)")
    op.execute("CREATE INDEX idx_images_ai_gin    ON images USING GIN (ai_metadata jsonb_path_ops)")

    # -------------------------------------------------------------------------
    # image_tags  (M2M junction)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE image_tags (
            image_id   UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            tag_id     UUID NOT NULL REFERENCES tags(id)   ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (image_id, tag_id)
        )
        """
    )
    op.execute("CREATE INDEX idx_image_tags_tag ON image_tags (tag_id)")

    # -------------------------------------------------------------------------
    # image_variants  (responsive delivery)
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE TABLE image_variants (
            id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            image_id        UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
            size            variant_size   NOT NULL,
            format          variant_format NOT NULL,
            storage_key     VARCHAR(500) NOT NULL,
            width_px        INTEGER NOT NULL CHECK (width_px > 0),
            height_px       INTEGER NOT NULL CHECK (height_px > 0),
            file_size_bytes BIGINT  NOT NULL CHECK (file_size_bytes > 0),
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            UNIQUE (image_id, size, format)
        )
        """
    )
    op.execute("CREATE INDEX idx_variants_image ON image_variants (image_id)")

    # -------------------------------------------------------------------------
    # Triggers
    # -------------------------------------------------------------------------
    op.execute(
        """
        CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
        """
    )
    op.execute(
        """
        CREATE TRIGGER set_updated_at_categories
            BEFORE UPDATE ON categories
            FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at()
        """
    )
    op.execute(
        """
        CREATE TRIGGER set_updated_at_images
            BEFORE UPDATE ON images
            FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at()
        """
    )

    op.execute(
        """
        CREATE OR REPLACE FUNCTION trg_tag_usage_count() RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'INSERT' THEN
                UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
            ELSIF TG_OP = 'DELETE' THEN
                UPDATE tags SET usage_count = GREATEST(usage_count - 1, 0) WHERE id = OLD.tag_id;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql
        """
    )
    op.execute(
        """
        CREATE TRIGGER track_tag_usage
            AFTER INSERT OR DELETE ON image_tags
            FOR EACH ROW EXECUTE FUNCTION trg_tag_usage_count()
        """
    )


# =============================================================================
# DOWNGRADE  (mirror image, reverse order)
# =============================================================================
def downgrade() -> None:
    # Triggers first (depend on tables)
    op.execute("DROP TRIGGER IF EXISTS track_tag_usage ON image_tags")
    op.execute("DROP TRIGGER IF EXISTS set_updated_at_images ON images")
    op.execute("DROP TRIGGER IF EXISTS set_updated_at_categories ON categories")

    # Trigger functions (no longer referenced)
    op.execute("DROP FUNCTION IF EXISTS trg_tag_usage_count()")
    op.execute("DROP FUNCTION IF EXISTS trg_set_updated_at()")

    # Break the categories <-> images cycle before dropping tables
    op.execute("ALTER TABLE categories DROP CONSTRAINT IF EXISTS fk_categories_cover_image")

    # Tables (children first)
    op.execute("DROP TABLE IF EXISTS image_variants")
    op.execute("DROP TABLE IF EXISTS image_tags")
    op.execute("DROP TABLE IF EXISTS images")
    op.execute("DROP TABLE IF EXISTS tags")
    op.execute("DROP TABLE IF EXISTS categories")

    # Enum types (now unreferenced)
    op.execute("DROP TYPE IF EXISTS variant_size")
    op.execute("DROP TYPE IF EXISTS variant_format")
    op.execute("DROP TYPE IF EXISTS image_source")
    op.execute("DROP TYPE IF EXISTS image_status")

    # Extensions are intentionally NOT dropped: they may be shared with other
    # schemas / applications in the same database, and re-creating them
    # requires superuser. Drop manually if you really want a clean slate:
    #
    #   DROP EXTENSION IF EXISTS citext;
    #   DROP EXTENSION IF EXISTS pg_trgm;
    #   DROP EXTENSION IF EXISTS "uuid-ossp";
