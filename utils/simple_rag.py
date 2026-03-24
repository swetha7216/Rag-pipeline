from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
import os
from langchain_community.vectorstores import FAISS
from .logger import logger
from .pdf_reader import read_pdf_text
from .text_splitter import split_text
from .vector_store import create_or_update_vector_db
from .llm_chain import build_llm_chain


class SimpleRAG:

    def __init__(self):
        logger.info("Initializing SimpleRAG")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.llm = Ollama(model="qwen3:1.7b")
        if os.path.exists("faiss_db"):
            logger.info("Loading existing FAISS database")
            self.vector_db = FAISS.load_local(
                "faiss_db",
                self.embeddings,
                allow_dangerous_deserialization=True
            )
        else:
            logger.info("No existing FAISS DB. Starting fresh.")
            self.vector_db = None
        logger.info("SimpleRAG initialized successfully")

    def read_text(self, pdf_path):
        return read_pdf_text(pdf_path)

    def chunk_text(self, text):
        return split_text(text)

    def store_in_vector_db(self, chunks, metadatas=None):
        self.vector_db = create_or_update_vector_db(
            chunks, self.embeddings, self.vector_db, metadatas=metadatas
        )

    def ask_question(self, question):
        if self.vector_db is None:
            raise ValueError("Vector DB not initialized")

        logger.info(f"Received question: {question}")
        retriever = self.vector_db.as_retriever(top_k=5)

        rag_chain = build_llm_chain(self.llm, retriever)
        answer = rag_chain.invoke(question)

        return answer

    # def clear_database(self):
    #     """Clears the vector database and resets the state."""
    #     import shutil
    #     if os.path.exists("faiss_db"):
    #         shutil.rmtree("faiss_db")
        
    #     self.vector_db = None
    #     logger.info("Database cleared")
    #     return True


# if __name__ == "__main__":
#     rag = SimpleRAG()
#     rag.clear_database()
