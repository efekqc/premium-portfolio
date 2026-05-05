from fastapi import APIRouter

from app.api.v1.endpoints import categories, images, tags, variants

api_router = APIRouter()
api_router.include_router(categories.router)
api_router.include_router(tags.router)
api_router.include_router(images.router)
api_router.include_router(variants.router)
