from langchain_community.vectorstores import FAISS
from .logger import logger
import os

FAISS_DIR = "faiss_db"

def create_or_update_vector_db(chunks, embeddings, vector_db=None, metadatas=None):
    if vector_db is None:
        logger.info("Creating new Vector DB")
        vector_db = FAISS.from_texts(chunks, embeddings, metadatas=metadatas)
    else:
        logger.info("Updating Vector DB with new chunks")
        vector_db.add_texts(chunks, metadatas=metadatas)

    # Save to disk so app can reload next time
    vector_db.save_local(FAISS_DIR)

    return vector_db
