# -*- coding: utf-8 -*-
"""
Yapılandırma Dosyası
Tüm sabitler ve ayarlar burada tanımlanır.
"""

import os

# === Dosya Yolları ===
# Proje kök dizinine göre göreli yollar
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "kaynaklar")
DB_PATH = os.path.join(BASE_DIR, "faiss_index")

# === Model Ayarları ===
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL = "llama3"  # Kararlılık ve doğruluk için llama3'e geri dönüldü

# === Metin Bölme Parametreleri ===
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# === Retriever Ayarları ===
RETRIEVER_K = 2  # Hız optimizasyonu (llama3 yavaş olduğu için context miktarını azalttık)
