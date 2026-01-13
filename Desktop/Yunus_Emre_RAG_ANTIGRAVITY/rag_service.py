# -*- coding: utf-8 -*-
"""
RAG Servisi
FAISS vektör veritabanını yükler ve sorgulara yanıt verir.
Hibrit Arama: BM25 (Kelime Bazlı) + FAISS (Vektör Bazlı)
"""

import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_ollama import ChatOllama
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever

from config import DB_PATH, EMBEDDING_MODEL, LLM_MODEL, RETRIEVER_K


# Yunus Emre hakkında doğru bilgi veren güçlü sistem promptu
# Yunus Emre hakkında doğru bilgi veren güçlü sistem promptu
# Yunus Emre hakkında doğru bilgi veren güçlü sistem promptu
# Yunus Emre hakkında uzman ve edebi bir dille bilgi veren sistem promptu
SYSTEM_PROMPT = """Sen Türkçe'yi edebî bir derinlikle kullanan, akademik bilgiyi halkın anlayacağı duru bir dille harmanlayan, hikaye anlatıcılığı güçlü bir Yunus Emre uzmanısın. Amacın, Yunus'un gönül dünyasını ve tarihi gerçekleri en doğru şekilde yansıtmaktır.

SES TONU VE ÜSLUP:
- Robotik değil, insani, sıcak ve bilge bir dil kullan.
- Bilgileri maddeler halinde sıralamak yerine, akıcı bir anlatı (narrative) içinde sun.
- "Değildir", "Yoktur" gibi sert negatifler yerine; "olmadığı kabul edilir", "yerine şu görüş ağırlık kazanmıştır" gibi yapıcı akademik bir dil kullan.

SABİT BİLGİLER VE KABULLER:
- Mürşidi: Hacı Bektaş-ı Veli ile manevi bir bağı olsa da, Yunus Emre'nin asıl mürşidi Tapduk Emre'dir. Bunu hikayenin doğal akışı içinde, Tapduk'un kapısında geçirdiği yılları anımsatarak verebilirsin.
- Doğum Yeri: Kesin bir bilgi bulunmamakla birlikte, akademik kaynaklar Sarıköy (Eskişehir) ihtimali üzerinde yoğunlaşır. Bursa veya diğer şehirlerle ilgili rivayetler bulunsa da, tarihçiler bunları genellikle isim benzerliklerine (örn. Âşık Yunus) dayandırır.
- Eserleri: Risâletü'n-Nushiyye ve Divan, onun tasavvufi derinliğini yansıtan temel hazineleridir. Tezkire gibi eserlerin ona atfedilmesi yaygın bir hatadır.

KAPSAM VE EDİTORYAL KURALLAR:
- Sadece Yunus Emre ve tasavvufi çevresiyle ilgili soruları yanıtla. Yemek tarifi, güncel siyaset gibi soruları, Yunus'un hoşgörüsüne yaraşır nazik bir dille geri çevir.
- Cevabını TEK BİR BÜTÜNLÜKLÜ METİN olarak kurgula. Asla başlık kullanma. Kendini tekrar etme.
- Yabancı terimlerden kaçın (Sadece Türkçe Latin alfabesi), öz Türkçe ve tasavvufi literatüre uygun kelimeler seç.

BAĞLAM:
{context}

SORU:
{input}

YANIT:
Yukarıdaki ilkeleri gözeterek, bağlamdaki bilgileri de kullanarak soruyu cevapla."""




class RAGService:
    """
    RAG (Retrieval-Augmented Generation) servisi.
    Hibrit Arama: FAISS (vektör) + BM25 (kelime bazlı) ile EnsembleRetriever.
    """
    
    def __init__(self):
        """
        Servisi başlatır: embedding modeli, vektör DB, BM25 ve LLM yüklenir.
        """
        # Embedding modelini yükle
        self.embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
        
        # FAISS vektör veritabanını diskten yükle
        self.vectorstore = FAISS.load_local(
            DB_PATH,
            self.embeddings,
            allow_dangerous_deserialization=True
        )
        
        # FAISS Retriever oluştur (Vektör Bazlı)
        self.faiss_retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": RETRIEVER_K}
        )
        
        # BM25 Retriever oluştur (Kelime Bazlı)
        # FAISS'teki dokümanları çek
        docs = list(self.vectorstore.docstore._dict.values())
        self.bm25_retriever = BM25Retriever.from_documents(docs)
        self.bm25_retriever.k = RETRIEVER_K
        
        # Hibrit Retriever: FAISS + BM25 birleştir
        self.retriever = EnsembleRetriever(
            retrievers=[self.faiss_retriever, self.bm25_retriever],
            weights=[0.5, 0.5]  # Eşit ağırlık
        )
        
        # LLM başlat (Ollama ile yerel Llama3)
        self.llm = ChatOllama(
            model=LLM_MODEL,
            temperature=0.1,  # Biraz esneklik için 0.1 yapıldı
            num_ctx=2048,     # Context penceresi
            repeat_penalty=1.1, # Tekrarı önleme
        )
        
        # RAG zinciri oluştur
        self._create_chain()
    
    def _create_chain(self):
        """Retrieval zincirini oluşturur."""
        # Prompt şablonu
        # Human mesajına Türkçe konuşma talimatını SAKLI (hidden) olarak ekliyoruz
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "{input} (Lütfen cevabını sadece TÜRKÇE ver. İngilizce cevap verme.)")
        ])
        
        # Doküman birleştirme zinciri
        question_answer_chain = create_stuff_documents_chain(
            self.llm, 
            prompt
        )
        
        # Tam RAG zinciri (Hibrit Retriever ile)
        self.chain = create_retrieval_chain(
            self.retriever, 
            question_answer_chain
        )
    
    def ask(self, query: str) -> str:
        """
        Kullanıcı sorusunu işler ve yanıt döndürür.
        
        Args:
            query: Kullanıcının sorusu
            
        Returns:
            LLM'in ürettiği yanıt metni
        """
        response = self.chain.invoke({"input": query})
        return response.get("answer", "Yanıt üretilemedi.")
    
    @staticmethod
    def is_db_available() -> bool:
        """FAISS veritabanının mevcut olup olmadığını kontrol eder."""
        index_file = os.path.join(DB_PATH, "index.faiss")
        return os.path.exists(index_file)

