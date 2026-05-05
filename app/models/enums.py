from enum import Enum


class ImageStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ImageSource(str, Enum):
    ORIGINAL = "original"
    SYNTHETIC = "synthetic"
    MIXED = "mixed"


class VariantFormat(str, Enum):
    JPEG = "jpeg"
    WEBP = "webp"
    AVIF = "avif"
    PNG = "png"


class VariantSize(str, Enum):
    THUMBNAIL = "thumbnail"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ORIGINAL = "original"
