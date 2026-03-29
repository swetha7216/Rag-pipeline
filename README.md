# RAG-Pipeline 🤖

# 📄 Retrieval-Augmented Generation (RAG) Application
### (Powered by Ollama – Gemma2:2B)

This project implements a **Retrieval-Augmented Generation (RAG)** system using a **locally running LLM (Gemma2:2B via Ollama)**.
It combines **document retrieval** with **context-aware generation** to answer user queries accurately — without relying on cloud-based APIs.

The project now features a **state-of-the-art 3D Glassmorphism UI** for a premium user experience.

---

## ❓ Problem Statement
Large Language Models (LLMs) like GPT-4 or Gemini are powerful, but they have significant limitations:
*   **Hallucinations**: They can confidently generate incorrect information.
*   **Knowledge Cutoff**: They are unaware of events or data created after their training date.
*   **No Private Knowledge**: They cannot answer questions about your specific documents, emails, or internal databases.

## 💡 The Solution: RAG Pipeline
This project bridges the gap using **Retrieval-Augmented Generation (RAG)**. Instead of relying solely on the LLM's pre-trained memory, the system:
1.  **Ingests** your private PDF documents.
2.  **Indexes** them into a searchable vector database.
3.  **Retrieves** the exact context relevant to your question.
4.  **Generates** an accurate answer based *only* on that context.

## 🚀 Why Use This Project?
*   **🔒 Complete Privacy**: Everything runs locally (**Ollama + FAISS**). Your sensitive documents never leave your machine.
*   **✅ Truthful Answers**: The model answers based on your data, significantly reducing hallucinations.
*   **💰 Zero Cost**: Uses open-source models (Gemma 2) and local compute, avoiding expensive API tokens.
*   **🎨 Premium UI**: A polished, modern interface that makes interacting with your documents a delight.

---

## 🚀 Features

-   **🖥️ Modern Web UI**: Premium 3D Glassmorphism design with interactive animations.
-   **📚 Multi-File Upload**: Drag & drop or select multiple PDFs at once.
-   **📂 Metadata Tracking**: Vector store tracks source filenames for accurate citation.
-   **💾 Persistent Storage**: FAISS vector database saves locally.
-   **🔍 Semantic Search**: Uses `sentence-transformers/all-MiniLM-L6-v2` embeddings.
-   **🤖 Local LLM**: Inference using **Ollama (Gemma2:2B)**.
-   **⚡ FastAPI Backend**: High-performance API for all RAG operations.
-   **🔐 Fully Local**: Complete offline privacy and security.

---

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (Vanilla), 3D Tilt Effects
-   **Backend**: FastAPI (Python)
-   **LLM Framework**: LangChain
-   **LLM**: Ollama – `gemma2:2b`
-   **Vector Store**: FAISS
-   **Embeddings**: HuggingFace (`all-MiniLM-L6-v2`)

---

## 📂 Project Structure

```
RAG-Pipeline/
│
├── api.py               # FastAPI Backend
├── main.py              # CLI Entry Point
├── serve_frontend.py    # Simple Python Web Server for UI
├── requirements.txt     # Python Dependencies
├── utils/
│   ├── simple_rag.py    # Core RAG Logic
│   ├── vector_store.py  # FAISS Vector Store Management
│   ├── pdf_reader.py    # PDF Text Extraction
│   ├── llm_chain.py     # LLM Chain & Prompt Engineering
│   ├── text_splitter.py # Text Chunking Logic
│   └── logger.py        # Logging Configuration
├── frontend/            # Modern Web UI
│   ├── index.html
│   ├── style.css
│   └── script.js
├── extracted_text/      # Directory for debugging extracted text
├── uploads/             # Directory for uploaded files
└── faiss_db/            # Local Vector Store (FAISS)
```

---

## ⚙️ Prerequisites

### 1️⃣ Install Ollama
Download and install Ollama from: https://ollama.com

Verify installation:
```bash
ollama --version
ollama pull gemma2:2b
ollama run gemma2:2b
```

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/nimmalaprasanthtirupatireddy-eng/RAG-Pipeline.git
cd RAG-Pipeline
```

### 3️⃣ Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ▶️ How to Run the Application

### 1️⃣ Start Ollama Server
Ollama usually runs automatically. If needed:
```bash
ollama serve
```

### 2️⃣ Start FastAPI Backend
Open a terminal and run:
```bash
uvicorn api:app --reload
```
API Docs: http://127.0.0.1:8000/docs

### 3️⃣ Start Modern UI (Recommended)
Open a **new terminal** and run:
```bash
python serve_frontend.py
```
👉 Access the App: http://localhost:8080

*(Optional)* Legacy Streamlit UI:
```bash
streamlit run app.py
```

---

## 🧠 RAG Pipeline Flow

1.  **Upload**: User uploads multiple PDFs via the UI.
2.  **Process**: Backend reads and splits text into chunks.
3.  **Embed**: Generates embeddings for each chunk (with metadata).
4.  **Store**: Saves embeddings to local FAISS index.
5.  **Query**: User asks a question in the chat.
6.  **Retrieve**: System finds top-k relevant chunks.
7.  **Generate**: LLM (Gemma2) answers using the retrieved context.

---

## 📌 Recent Updates

-   ✅ **UI Overhaul**: Implemented Gemini-style input bar and document drawer.
-   ✅ **Multi-File Support**: Upload and process batches of PDFs.
-   ✅ **Prompt Engineering**: Enhanced LLM prompt for better table interpretation and data analysis.
-   ✅ **Raw Text Extraction**: Automatically extracts and saves processed PDF text to `extracted_text/combined.txt` for inspection.
-   ✅ **Interactive 3D**: Added tilt effects and 3D welcome animations.
-   ✅ **Performance**: Optimized text chunking and storage.

---

## 📌 Future Enhancements

-   🔄 Multi-model switching (Llama3, Mistral) via UI
-   🔐 User authentication system
-   📊 Query analytics dashboard
-   🕸️ Web scraping for dynamic context

---

## 🤝 Contributing

Contributions are welcome! Fork the repository and submit a pull request.

## ⭐ Acknowledgements

-   Ollama
-   Google Gemma
-   LangChain
-   FastAPI

---

### Created by & Contact

**Name**: Nimmala Prasanth Tirupati Reddy
**Email**: nimmalaprasanthtirupatireddy@gmail.com
**GitHub**: [nimmalaprasanthtirupatireddy-eng](https://github.com/nimmalaprasanthtirupatireddy-eng)
