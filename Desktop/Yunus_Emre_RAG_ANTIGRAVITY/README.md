# 📜 Yunus Emre RAG Asistanı (Senior Versiyon)

Yunus Emre'nin hayatı, eserleri ve tasavvufi dünyası hakkında sorularınızı yanıtlayan, edebi derinliğe sahip yapay zeka destekli sohbet asistanı.

## 🚀 Öne Çıkan Özellikler

- **Hibrit Arama (Hybrid Search)**: `BM25` (Kelime bazlı) ve `FAISS` (Vektör bazlı) algoritmalarını birleştirerek (`EnsembleRetriever`) en isabetli sonuçları getirir.
- **Senior Persona**: Robotik cevaplar yerine, bir edebiyat uzmanı gibi akıcı, hikaye anlatıcılığı güçlü ve akademik bir dille konuşur.
- **Dil ve Üslup Koruması**:
    - %100 Türkçe yanıt garantisi.
    - Latin alfabesi dışında (Çince, Kiril vb.) karakter koruması.
    - Negatif ve savunmacı dil yerine yapıcı akademik dil.
- **Doğruluk Odaklı**: `llama3` (8B) modeli kullanılarak halüsinasyonlar minimuma indirilmiştir. "Bursa'da doğdu" gibi yaygın yanlışları akademik dille düzeltir.
- **Performans Takibi**: Her yanıtın altında, o yanıtın kaç saniyede üretildiğini gösteren sayaç bulunur.

## 📋 Gereksinimler

- Python 3.9+
- Ollama (ve `llama3` modeli)
- Gerekli Kütüphaneler: `requirements.txt` içinde listelenmiştir.

## 🛠️ Kurulum

1. **Bağımlılıkları Yükleyin:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ollama Modelini Hazırlayın:**
   ```bash
   ollama pull llama3
   ```

3. **Veritabanını Oluşturun:**
   ```bash
   python ingest.py
   ```

## ▶️ Çalıştırma

Uygulamayı başlatmak için:

```bash
streamlit run app.py
```

Tarayıcınızda `http://localhost:8501` adresine giderek asistanla sohbet etmeye başlayabilirsiniz.

## 📁 Proje Yapısı

- `app.py`: Streamlit arayüzü ve Zamanlayıcı (Timer) mantığı.
- `rag_service.py`: Hibrit Arama, System Prompt (Persona) ve LLM ayarları.
- `config.py`: Model (`llama3`), Retriever (`K=2`) ve yol ayarları.
- `ingest.py`: Kaynak dokümanları vektör veritabanına dönüştürücü.
- `kaynaklar/`: Yunus Emre biyografisi ve eserleri hakkında metinler.

## ⚠️ Performans Notu

Bu proje, doğruluk ve edebi kaliteyi ön planda tuttuğu için **Llama3 (8B)** modelini kullanır. Yanıt süreleri donanımınıza bağlı olarak **60-150 saniye** arasında değişebilir. Hız optimizasyonu için `RETRIEVER_K` değeri düşürülmüştür.

## 📚 Kaynakça
İçerikler, TDV İslam Ansiklopedisi (Prof. Dr. Mustafa Tatcı) ve tasavvufi akademik kaynaklardan derlenmiştir.
