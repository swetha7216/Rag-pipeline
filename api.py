# from fastapi import FastAPI, UploadFile, File 
# import shutil 
# import os 
# from main import SimpleRAG 

# app = FastAPI(title="Simple RAG API") 

# rag = SimpleRAG() 

# UPLOAD_DIR = "uploads" 
# os.makedirs(UPLOAD_DIR, exist_ok=True) 

# @app.post("/upload-pdf/") 
# def upload_pdf(file: UploadFile = File(...)): 
#     file_path = os.path.join(UPLOAD_DIR, file.filename) 
    
#     with open(file_path, "wb") as buffer: 
#         shutil.copyfileobj(file.file, buffer) 
#         text =rag.read_text(file_path) 
#         chunks =rag.chunk_text(text) 
#         rag.store_in_vector_db(chunks) 
#     return {"message": "PDF processed and stored successfully"} 

# @app.post("/ask/") 
# def ask_question(question: str): 
#     answer = rag.ask_question(question) 
#     return {"answer": answer}

# from fastapi import FastAPI
# from main import SimpleRAG

# app = FastAPI(title="Simple RAG API")

# rag = SimpleRAG()

# @app.get("/")
# def health():
#     return {"status": "RAG API running"}

# @app.post("/ask/")
# def ask_question(question: str):
#     answer =rag.ask_question(question)
#     return {"answer": answer}


# from fastapi import FastAPI, UploadFile, File 
# import shutil 
# import os 
# from main import SimpleRAG 

# app = FastAPI(title="Simple RAG API") 

# rag = SimpleRAG() 

# UPLOAD_DIR = "uploads" 
# os.makedirs(UPLOAD_DIR, exist_ok=True) 

# @app.post("/upload-pdf/") 
# def upload_pdf(question: str,file: UploadFile = File(...)): 
#     file_path = os.path.join(UPLOAD_DIR, file.filename) 
    
#     with open(file_path, "wb") as buffer: 
#         shutil.copyfileobj(file.file, buffer) 
#         text =rag.read_text(file_path) 
#         chunks =rag.chunk_text(text) 
#         rag.store_in_vector_db(chunks) 
#     print({"message": "PDF processed and stored successfully"}) 
#     answer = rag.ask_question(question) 
#     return {"answer": answer}

from fastapi import FastAPI, UploadFile, File
# from fastapi.responses import StreamingResponse
import shutil
import os
from utils.simple_rag import SimpleRAG

app = FastAPI(title="Simple RAG API")


rag = SimpleRAG()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload-pdf/")
def upload_pdf(files: list[UploadFile] = File(...)):
    all_chunks = []
    all_metadatas = []
    
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = rag.read_text(file_path)
        chunks = rag.chunk_text(text)
        
        # Add metadata for each chunk
        metadatas = [{"source": file.filename} for _ in chunks]
        
        all_chunks.extend(chunks)
        all_metadatas.extend(metadatas)
        
    rag.store_in_vector_db(all_chunks, metadatas=all_metadatas)

    return {"message": f"{len(files)} PDF(s) processed and stored successfully"}


@app.post("/ask/")
def ask_question(question: str):
    answer = rag.ask_question(question)
    return {"answer": answer}


# @app.post("/clear-db/")
# def clear_db():
#     rag.clear_database()
#     return {"message": "Database cleared successfully"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)