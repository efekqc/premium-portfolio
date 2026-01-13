# -*- coding: utf-8 -*-
"""
Streamlit Kullanıcı Arayüzü
Yunus Emre RAG Chatbot
"""

import streamlit as st
import time
from rag_service import RAGService


# === Sayfa Yapılandırması ===
st.set_page_config(
    page_title="Yunus Emre Asistanı",
    page_icon="📜",
    layout="centered"
)


@st.cache_resource
def get_rag_service():
    """
    RAGService singleton örneği oluşturur.
    Bu fonksiyon sayesinde model her etkileşimde yeniden yüklenmez.
    """
    return RAGService()


def main():
    """Ana uygulama fonksiyonu."""
    
    # === Başlık ===
    st.title("📜 Yunus Emre Asistanı")
    st.markdown("*Türk tasavvuf edebiyatının büyük şairi hakkında sorularınızı sorun.*")
    st.divider()
    
    # === Veritabanı Kontrolü ===
    if not RAGService.is_db_available():
        st.error(
            "⚠️ **Vektör veritabanı bulunamadı!**\n\n"
            "Lütfen önce aşağıdaki komutu çalıştırın:\n"
            "```bash\npython ingest.py\n```"
        )
        st.stop()
    
    # === RAG Servisini Yükle ===
    with st.spinner("🔄 Model yükleniyor..."):
        rag_service = get_rag_service()
    
    # === Sohbet Geçmişi (Session State) ===
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Geçmiş mesajları göster
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # === Kullanıcı Girişi ===
    if prompt := st.chat_input("Yunus Emre hakkında bir soru sorun..."):
        # Kullanıcı mesajını ekle ve göster
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Asistan yanıtı - placeholder ile gölge efektini önle
        with st.chat_message("assistant"):
            response_placeholder = st.empty()
            response_placeholder.markdown("🤔 Düşünüyorum...")
            
            # Süreyi başlat
            start_time = time.time()
            
            response = rag_service.ask(prompt)
            
            # Süreyi bitir
            end_time = time.time()
            duration = end_time - start_time
            
            # Yanıtı ve süreyi göster
            full_response = f"{response}\n\n---\n*⏱️ Yanıt süresi: {duration:.2f} saniye*"
            response_placeholder.markdown(full_response)
        
        # Yanıtı geçmişe ekle (süresiyle birlikte)
        st.session_state.messages.append({"role": "assistant", "content": full_response})


if __name__ == "__main__":
    main()
