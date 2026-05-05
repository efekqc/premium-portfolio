"""
seed.py — Populate premium_portfolio with food & restaurant dummy data.

Run:
    python seed.py

Requires DATABASE_URL set in .env (or environment).
The script converts the SQLAlchemy asyncpg DSN to a plain asyncpg DSN automatically.
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from uuid import uuid4

import asyncpg

# Load .env without requiring python-dotenv
def _load_env():
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())

_load_env()

_raw_url = os.environ.get("DATABASE_URL", "")
if not _raw_url:
    sys.exit("ERROR: DATABASE_URL not set. Add it to .env or export it.")

# Convert postgresql+asyncpg://... → postgresql://... for native asyncpg.connect()
DSN = _raw_url.replace("postgresql+asyncpg://", "postgresql://")
# If DB_USE_SSL is true, append sslmode so asyncpg enables SSL
if os.environ.get("DB_USE_SSL", "").lower() in ("1", "true", "yes"):
    DSN = DSN.rstrip("/") if "?" not in DSN else DSN
    DSN += ("&" if "?" in DSN else "?") + "sslmode=require"

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

CATEGORIES = [
    {
        "id": str(uuid4()),
        "slug": "fine-dining",
        "name": "Fine Dining",
        "description": "Plated artistry from Michelin-starred kitchens and their AI-simulated counterparts.",
        "sort_order": 1,
        "is_featured": True,
    },
    {
        "id": str(uuid4()),
        "slug": "street-food",
        "name": "Street Food",
        "description": "Raw, honest, and unapologetically photogenic food from markets and carts worldwide.",
        "sort_order": 2,
        "is_featured": False,
    },
    {
        "id": str(uuid4()),
        "slug": "avant-garde-desserts",
        "name": "Avant-Garde Desserts",
        "description": "Molecular gastronomy, edible art, and sugar sculptures at the frontier of pastry.",
        "sort_order": 3,
        "is_featured": True,
    },
]

# Unsplash images via direct CDN URLs (storage_key = full URL; storageUrl() passes them through).
# Each image is landscape or portrait to demonstrate varied aspect ratios in the grid.
IMAGES = [
    # ── Fine Dining ──────────────────────────────────────────────────────────
    {
        "slug": "wagyu-tasting-menu",
        "category_slug": "fine-dining",
        "title": "Wagyu A5 Tasting Menu",
        "alt_text": "Perfectly seared A5 wagyu slices fanned on a black slate with microgreens",
        "caption": "48-hour sous-vide, then 30 seconds on cast iron.",
        "description": "A synthetic recreation of the tasting menu centrepiece at a three-star Tokyo kaiseki. The model captured the Maillard gradient with uncanny precision.",
        "storage_key": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1843200,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#2a1a0e",
        "blur_hash": "L9B|]YM{4n%L~qof-;j[%MxuWBof",
        "status": "published",
        "source": "synthetic",
        "is_featured": True,
        "sort_order": 1,
        "exif_data": {},
        "ai_metadata": {
            "model": "Stable Diffusion XL 1.0",
            "prompt": "A5 wagyu beef, tasting menu, black slate plate, microgreens garnish, dramatic side lighting, cinematic food photography, 8k resolution, shallow depth of field",
            "negative_prompt": "cartoon, illustration, oversaturated, noise, low quality",
            "steps": 60,
            "cfg_scale": 7.5,
            "seed": 1138,
            "sampler": "DPM++ 2M Karras",
            "generation_time": "18.4s",
            "upscaled": True,
        },
        "tags": ["wagyu", "fine-dining", "japanese"],
    },
    {
        "slug": "deconstructed-bouillabaisse",
        "category_slug": "fine-dining",
        "title": "Deconstructed Bouillabaisse",
        "alt_text": "Provençal fish broth served in a geometric glass vessel with saffron foam",
        "caption": "Geometry meets the Marseille coastline.",
        "description": "A modernist take on the Provençal classic. Saffron aioli foam suspended over a clarified fish consommé in a hand-blown borosilicate vessel.",
        "storage_key": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 2150400,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#c8a96e",
        "blur_hash": "LcIE6kxu4nWB~qt7IUj[%Ms.WBof",
        "status": "published",
        "source": "mixed",
        "is_featured": True,
        "sort_order": 2,
        "exif_data": {
            "Make": "Sony",
            "Model": "A7R V",
            "FocalLength": "90mm",
            "FNumber": 2.8,
            "ExposureTime": "1/160",
            "ISO": 400,
        },
        "ai_metadata": {
            "model": "ControlNet + SDXL",
            "prompt": "deconstructed bouillabaisse, geometric glass vessel, saffron foam, modernist plating, soft window light, editorial food photography",
            "steps": 45,
            "cfg_scale": 8.0,
            "seed": 9012,
            "generation_time": "21.2s",
            "controlnet_mode": "depth",
        },
        "tags": ["french", "fine-dining", "seafood"],
    },
    {
        "slug": "charred-octopus-romesco",
        "category_slug": "fine-dining",
        "title": "Charred Octopus & Romesco",
        "alt_text": "Charred octopus tentacle on smoked paprika romesco with pickled fennel",
        "caption": "Smoke, char, and Spanish sun.",
        "description": "Grilled over charcoal at 900°C for 90 seconds. The romesco was blended tableside, thickened with grilled almonds.",
        "storage_key": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1720000,
        "width_px": 1600,
        "height_px": 1200,
        "dominant_color": "#5c2c0e",
        "blur_hash": "L9EMn*IU9F%M~qxut7WB%Mt7ofWB",
        "status": "published",
        "source": "original",
        "is_featured": False,
        "sort_order": 3,
        "exif_data": {
            "Make": "Canon",
            "Model": "EOS R5",
            "FocalLength": "100mm",
            "FNumber": 2.5,
            "ExposureTime": "1/250",
            "ISO": 320,
        },
        "ai_metadata": {},
        "tags": ["spanish", "fine-dining", "seafood"],
    },
    # ── Street Food ──────────────────────────────────────────────────────────
    {
        "slug": "tokyo-ramen-midnight",
        "category_slug": "street-food",
        "title": "Tokyo Ramen — Midnight",
        "alt_text": "Rich tonkotsu ramen bowl with chashu pork, soft egg, and nori in moody neon light",
        "caption": "Shinjuku, 2 AM. The broth has been simmering since noon.",
        "description": "Tonkotsu broth rendered synthetically with a DDPM model trained on 40,000 ramen images. The neon reflections on the pork fat are the model's own invention.",
        "storage_key": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1950000,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#1a0c06",
        "blur_hash": "L24n=H9Z00~q~qj[WB%M00M{Rj%M",
        "status": "published",
        "source": "synthetic",
        "is_featured": True,
        "sort_order": 1,
        "exif_data": {},
        "ai_metadata": {
            "model": "DDPM v2 (Ramen-LoRA)",
            "prompt": "tonkotsu ramen, chashu pork, soft-boiled egg, nori, neon reflections, moody night scene, Japanese street food, cinematic lighting, 8k, photorealistic",
            "negative_prompt": "daytime, bright, oversaturated, cartoon",
            "steps": 80,
            "cfg_scale": 9.0,
            "seed": 77423,
            "sampler": "DDIM",
            "generation_time": "24.1s",
            "lora": "ramen-realism-v3",
            "lora_weight": 0.85,
        },
        "tags": ["japanese", "noodles", "street-food"],
    },
    {
        "slug": "smash-burger-golden-hour",
        "category_slug": "street-food",
        "title": "Smash Burger — Golden Hour",
        "alt_text": "Double smash burger with caramelised onions and cheese pull in warm sunset light",
        "caption": "Two 80/20 patties. One perfect moment.",
        "description": "Shot during the 11-minute golden window at a pop-up burger truck in East London. The cheese pull was assisted by a heat gun held just off-frame.",
        "storage_key": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 2240000,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#b85c1a",
        "blur_hash": "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
        "status": "published",
        "source": "original",
        "is_featured": False,
        "sort_order": 2,
        "exif_data": {
            "Make": "Fujifilm",
            "Model": "X-T5",
            "FocalLength": "56mm",
            "FNumber": 1.4,
            "ExposureTime": "1/500",
            "ISO": 160,
            "WhiteBalance": "Daylight",
        },
        "ai_metadata": {},
        "tags": ["american", "burger", "street-food"],
    },
    {
        "slug": "pad-thai-wok-hei",
        "category_slug": "street-food",
        "title": "Pad Thai — Wok Hei",
        "alt_text": "Pad Thai being tossed in a flaming wok at a Bangkok night market",
        "caption": "The flame is part of the flavour.",
        "description": "Captured at a Bangkok market stall. The wok hei — that elusive smoky breath of a properly superheated wok — is visible in the char on the noodle edges.",
        "storage_key": "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1680000,
        "width_px": 1600,
        "height_px": 1200,
        "dominant_color": "#8c4a12",
        "blur_hash": "L9C?jbM{4n~q~qx]RjWB%Mt7WBj[",
        "status": "published",
        "source": "original",
        "is_featured": False,
        "sort_order": 3,
        "exif_data": {
            "Make": "Sony",
            "Model": "A7 IV",
            "FocalLength": "35mm",
            "FNumber": 1.8,
            "ExposureTime": "1/1000",
            "ISO": 3200,
        },
        "ai_metadata": {},
        "tags": ["thai", "noodles", "street-food"],
    },
    # ── Avant-Garde Desserts ─────────────────────────────────────────────────
    {
        "slug": "nitrogen-mango-sphere",
        "category_slug": "avant-garde-desserts",
        "title": "Liquid Nitrogen Mango Sphere",
        "alt_text": "Perfectly round mango sorbet sphere resting on a black mirror plate, surrounded by nitrogen mist",
        "caption": "−196 °C meets Alphonso mango.",
        "description": "A molecularly spherified mango purée shell, hardened in liquid nitrogen and served on a warmed obsidian slab. The temperature differential causes the mist you see here to be real — this is not composited.",
        "storage_key": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1560000,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#f5a623",
        "blur_hash": "LHO|n~Io00?b~qM{D%j@0KxtM{s:",
        "status": "published",
        "source": "mixed",
        "is_featured": True,
        "sort_order": 1,
        "exif_data": {
            "Make": "Nikon",
            "Model": "Z9",
            "FocalLength": "105mm",
            "FNumber": 4.0,
            "ExposureTime": "1/125",
            "ISO": 200,
        },
        "ai_metadata": {
            "model": "Stable Diffusion XL + ControlNet",
            "prompt": "liquid nitrogen mist, mango sphere, obsidian plate, minimalist plating, soft studio light, molecular gastronomy, high-end pastry",
            "controlnet_mode": "canny",
            "steps": 35,
            "cfg_scale": 7.0,
            "seed": 55901,
            "generation_time": "16.8s",
        },
        "tags": ["dessert", "molecular", "avant-garde"],
    },
    {
        "slug": "matcha-opera-cake",
        "category_slug": "avant-garde-desserts",
        "title": "Matcha & Black Sesame Opéra",
        "alt_text": "Cross-section of a matcha joconde opéra cake with precise alternating layers on white marble",
        "caption": "Seven layers. Zero tolerance for imprecision.",
        "description": "Each of the seven alternating layers — matcha joconde, black sesame buttercream, and white chocolate ganache — is exactly 4mm thick. Synthetically generated with a diffusion model fine-tuned on patisserie cross-sections.",
        "storage_key": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1600&q=85",
        "mime_type": "image/jpeg",
        "file_size_bytes": 1420000,
        "width_px": 1600,
        "height_px": 1067,
        "dominant_color": "#3d6b4f",
        "blur_hash": "L8C?jN%M4n%M~qt7RjWBM{IUWBj[",
        "status": "published",
        "source": "synthetic",
        "is_featured": False,
        "sort_order": 2,
        "exif_data": {},
        "ai_metadata": {
            "model": "Fine-tuned SDXL (PâtisserieXL-v2)",
            "prompt": "matcha opera cake cross section, black sesame buttercream, white chocolate ganache, precise layers, white marble, overhead shot, pastel editorial, 4k",
            "negative_prompt": "messy, crumbling, blurry, low contrast",
            "steps": 55,
            "cfg_scale": 8.5,
            "seed": 31417,
            "sampler": "DPM++ SDE Karras",
            "generation_time": "19.7s",
            "fine_tune_dataset": "patisserie-cross-sections-12k",
        },
        "tags": ["dessert", "japanese", "avant-garde", "matcha"],
    },
]

# Tags to ensure exist (slug → name → color)
TAGS = {
    "wagyu":       ("Wagyu",          "#c0392b"),
    "fine-dining": ("Fine Dining",    "#8e44ad"),
    "japanese":    ("Japanese",       "#e74c3c"),
    "french":      ("French",         "#2980b9"),
    "seafood":     ("Seafood",        "#1abc9c"),
    "spanish":     ("Spanish",        "#e67e22"),
    "noodles":     ("Noodles",        "#f39c12"),
    "street-food": ("Street Food",    "#27ae60"),
    "american":    ("American",       "#e74c3c"),
    "burger":      ("Burger",         "#d35400"),
    "thai":        ("Thai",           "#16a085"),
    "dessert":     ("Dessert",        "#9b59b6"),
    "molecular":   ("Molecular",      "#34495e"),
    "avant-garde": ("Avant-Garde",    "#2c3e50"),
    "matcha":      ("Matcha",         "#27ae60"),
}


# ---------------------------------------------------------------------------
# Seed logic
# ---------------------------------------------------------------------------
async def seed():
    print("Connecting to", DSN.replace("//", "//***@").split("@")[-1], "...")
    conn = await asyncpg.connect(DSN)
    print("Connected.\n")

    try:
        # -- Tags -------------------------------------------------------
        print("Upserting tags...")
        tag_id_map: dict[str, str] = {}
        for slug, (name, color) in TAGS.items():
            row = await conn.fetchrow(
                """
                INSERT INTO tags (id, slug, name, color_hex)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
                RETURNING id
                """,
                str(uuid4()), slug, name, color,
            )
            tag_id_map[slug] = str(row["id"])
        print(f"  {len(TAGS)} tags ready.")

        # -- Categories -------------------------------------------------
        print("Upserting categories...")
        cat_id_map: dict[str, str] = {}
        for cat in CATEGORIES:
            row = await conn.fetchrow(
                """
                INSERT INTO categories (id, slug, name, description, sort_order, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (slug) DO UPDATE
                    SET name = EXCLUDED.name,
                        description = EXCLUDED.description
                RETURNING id
                """,
                cat["id"], cat["slug"], cat["name"],
                cat["description"], cat["sort_order"], cat["is_featured"],
            )
            cat_id_map[cat["slug"]] = str(row["id"])
        print(f"  {len(CATEGORIES)} categories ready.")

        # -- Images -----------------------------------------------------
        print("Upserting images...")
        for img in IMAGES:
            cat_id = cat_id_map[img["category_slug"]]
            image_id = str(uuid4())

            row = await conn.fetchrow(
                """
                INSERT INTO images (
                    id, slug, title, alt_text, caption, description,
                    category_id, status, source,
                    storage_key, mime_type, file_size_bytes,
                    width_px, height_px,
                    dominant_color, blur_hash,
                    exif_data, ai_metadata,
                    is_featured, sort_order,
                    published_at
                ) VALUES (
                    $1,  $2,  $3,  $4,  $5,  $6,
                    $7,  $8,  $9,
                    $10, $11, $12,
                    $13, $14,
                    $15, $16,
                    $17::jsonb, $18::jsonb,
                    $19, $20,
                    NOW()
                )
                ON CONFLICT (slug) DO UPDATE
                    SET title      = EXCLUDED.title,
                        ai_metadata = EXCLUDED.ai_metadata,
                        status     = EXCLUDED.status
                RETURNING id
                """,
                image_id,
                img["slug"], img["title"], img["alt_text"],
                img.get("caption"), img.get("description"),
                cat_id, img["status"], img["source"],
                img["storage_key"], img["mime_type"], img["file_size_bytes"],
                img["width_px"], img["height_px"],
                img.get("dominant_color"), img.get("blur_hash"),
                json.dumps(img["exif_data"]), json.dumps(img["ai_metadata"]),
                img["is_featured"], img["sort_order"],
            )
            actual_id = str(row["id"])

            # Re-fetch to honour ON CONFLICT (get existing id if slug already existed)
            actual_id = str(
                (await conn.fetchrow("SELECT id FROM images WHERE slug = $1", img["slug"]))["id"]
            )

            # -- image_tags M2M ----------------------------------------
            for tag_slug in img.get("tags", []):
                if tag_slug in tag_id_map:
                    await conn.execute(
                        """
                        INSERT INTO image_tags (image_id, tag_id)
                        VALUES ($1, $2)
                        ON CONFLICT DO NOTHING
                        """,
                        actual_id, tag_id_map[tag_slug],
                    )
            print(f"  ✓ {img['slug']}")

        print(f"\n{len(IMAGES)} images seeded successfully.")
        print("\nSeed complete. Run `npm run dev` in client/ and the FastAPI server to view.")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
