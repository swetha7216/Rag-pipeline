from langchain.text_splitter import RecursiveCharacterTextSplitter
from .logger import logger

def split_text(text):
    logger.info("Splitting text into chunks")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )
    chunks = splitter.split_text(text)
    logger.info(f"Created {len(chunks)} chunks")
    return chunks
