# -*- coding: utf-8 -*-
"""
Veri İşleme ve Embedding Pipeline (ETL)
Bu script bir kez çalıştırılarak FAISS vektör veritabanını oluşturur.
"""

import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from config import DATA_PATH, DB_PATH, EMBEDDING_MODEL, CHUNK_SIZE, CHUNK_OVERLAP


def main():
    """Ana ETL pipeline fonksiyonu."""
    
    # === 1. Dokümanları Yükle ===
    print("📖 Dokümanlar okunuyor...")
    loader = DirectoryLoader(
        DATA_PATH,
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
    )
    documents = loader.load()
    print(f"   ✓ {len(documents)} doküman yüklendi.")
    
    if not documents:
        print("❌ Hata: 'kaynaklar' klasöründe .txt dosyası bulunamadı!")
        return
    
    # === 2. Metinleri Böl ===
    print("✂️  Metinler parçalara ayrılıyor...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"   ✓ {len(chunks)} parça oluşturuldu.")
    
    # === 3. Embedding Oluştur ve FAISS Index Yap ===
    print("🧠 Embedding modeli yükleniyor...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    
    print("🗃️  FAISS vektör veritabanı oluşturuluyor...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    # === 4. Diske Kaydet ===
    print("💾 Veritabanı diske kaydediliyor...")
    vectorstore.save_local(DB_PATH)
    
    print(f"\n✅ İşlem tamamlandı!")
    print(f"   📁 Veritabanı konumu: {DB_PATH}")
    print(f"   📊 Toplam vektör sayısı: {len(chunks)}")


if __name__ == "__main__":
    main()
