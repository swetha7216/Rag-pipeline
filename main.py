# import logging
# from PyPDF2 import PdfReader 
# from langchain.text_splitter import RecursiveCharacterTextSplitter 
# from langchain_huggingface import HuggingFaceEmbeddings 
# from langchain_core.runnables import RunnablePassthrough
# from langchain.llms import Ollama 
# from langchain.vectorstores import FAISS
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser

# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s | %(levelname)s | %(message)s"
# )
# logger = logging.getLogger(__name__)


# class SimpleRAG: 
#     def __init__(self): 
#         logger.info("Initializing SimpleRAG")
#         self.embeddings = HuggingFaceEmbeddings( 
#             model_name="sentence-transformers/all-MiniLM-L6-v2"
#             ) 
#         self.llm = Ollama(model="gemma2:2b") 
#         self.vector_db = None
#         self.prompt = PromptTemplate(
        #     template="""
        #     You are a document-based assistant.

        #     Task:
        #     Answer the user's question using ONLY the provided context.

        #     Content:
        #     {content}

        #     Question:
        #     {question}

        #     Strict Rules (follow in order):

        #     Step 1:
        #     Check whether the context contains enough information
        #     to answer the question.

        #     - If NO, respond exactly:
        #     "The answer is not available in the provided documents."
        #     - STOP immediately.

        #     Step 2:
        #     If YES, identify the question type answer with sutable one answer type:
        #     - Definition (what is / meaning)
        #     - Steps or Process (how / steps / procedure)
        #     - Concept or Explanation (why / concept / theory)

        #     Step 3:
        #     Format the answer accordingly:
        #     - Definition → ONE clear paragraph
        #     - Steps/Process → Numbered points
        #     - Concept → Explanation WITH a simple example

        #     Additional Rules:
        #     - Use ONLY the given context
        #     - Do NOT add external knowledge
        #     - Do NOT guess or infer""",
        #     input_variables=["content","question"]
        # )
        # self.parser = StrOutputParser()
        # logger.info("SimpleRAG initialized successfully")
    
#     def read_text(self, pdf_path): 
#         logger.info(f"Reading PDF:{pdf_path}")
#         reader = PdfReader(pdf_path) 
#         text = "" 
        
#         for i,page in enumerate(reader.pages): 
#             page_text = page.extract_text() 
            
#             if page_text: 
#                 text += page_text + "\n" 
#             logger.debug(f"Processed page {i+1}")
#         logger.info(f"Finished reading PDF ({len(reader.pages)} pages)")
#         return text 
    
#     def chunk_text(self, text): 
#         logger.info("Splitting text into chunks")
#         splitter = RecursiveCharacterTextSplitter( chunk_size=500, chunk_overlap=100 )
#         chunks = splitter.split_text(text) 
#         logger.info(f"Created {len(chunks)}")
#         return chunks 
    
#     def store_in_vector_db(self, chunks): 
#         logger.info("Storing chunks in vector database")
#         if self.vector_db is None:
#             self.vector_db = FAISS.from_texts(chunks, self.embeddings) 
#             logger.info("Vector DB created")
#         else:
#             self.vector_db.add_texts(chunks)
#             logger.info("Vector DB updated with new chunks")
    
#     def ask_question(self, question): 
#         logger.info(f"Recived question : {question}")
#         if self.vector_db is None: 
#             logger.info("Vector DB not intialized")
#             raise ValueError("Vector DB not initialized") 
#         retriever = self.vector_db.as_retriever()

#         docs = retriever.get_relevant_documents(question)
#         logger.info(f"Retrived {len(docs)} relevent documnets")

#         for i , doc in enumerate(docs):
#             logger.info(f"Doc {i+1} : {doc.page_content[:200]}")

#         rag_chain = (
#             {
#                 "content":retriever,
#                 "question":RunnablePassthrough()
#             }
#             |self.prompt
#             |self.llm
#             |self.parser
#         )

#         logger.info("Invoke RAG chain")
#         answer = rag_chain.invoke(question)

#         logger.info("LLM response generated")
#         return answer


# import logging
# import os
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_core.runnables import RunnablePassthrough
# from langchain.llms import Ollama
# from langchain.vectorstores import FAISS
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser


# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s | %(levelname)s | %(message)s"
# )
# logger = logging.getLogger(__name__)


# class SimpleRAG:
#     def __init__(self):
#         logger.info("Initializing SimpleRAG")

#         self.embeddings = HuggingFaceEmbeddings(
#             model_name="sentence-transformers/all-MiniLM-L6-v2"
#         )

#         self.llm = Ollama(model="gemma2:2b")
#         self.vector_db = None

#         self.prompt = PromptTemplate(
#             template="""
#             Your an Helpful Assistant
#             Use the following context to answer the question.
#             If the answer is not in the context, say "I don't know".
            
#             Content:
#             {content}

#             Question:
#             {question}

#             Answer:
#             """,
#             input_variables=["content", "question"]
#         )

#         self.parser = StrOutputParser()

#         self.load_pdfs_from_directory("data/pdfs")

#         logger.info("SimpleRAG initialized successfully")

#     def read_text(self, pdf_path):
#         logger.info(f"Reading PDF:{pdf_path}")
#         reader = PdfReader(pdf_path)
#         text = ""

#         for i, page in enumerate(reader.pages):
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + "\n"
#             logger.debug(f"Processed page {i + 1}")

#         logger.info(f"Finished reading PDF ({len(reader.pages)} pages)")
#         return text

#     def chunk_text(self, text):
#         logger.info("Splitting text into chunks")
#         splitter = RecursiveCharacterTextSplitter(
#             chunk_size=500,
#             chunk_overlap=100
#         )
#         chunks = splitter.split_text(text)
#         logger.info(f"Created {len(chunks)} chunks")
#         return chunks

#     def store_in_vector_db(self, chunks):
#         logger.info("Storing chunks in vector database")
#         if self.vector_db is None:
#             self.vector_db = FAISS.from_texts(chunks, self.embeddings)
#             logger.info("Vector DB created")
#         else:
#             self.vector_db.add_texts(chunks)
#             logger.info("Vector DB updated with new chunks")

#     def load_pdfs_from_directory(self, pdf_dir):
#         logger.info(f"Loading PDFs from directory: {pdf_dir}")

#         if not os.path.exists(pdf_dir):
#             raise ValueError(f"PDF directory not found: {pdf_dir}")

#         for file_name in os.listdir(pdf_dir):
#             if file_name.lower().endswith(".pdf"):
#                 pdf_path = os.path.join(pdf_dir, file_name)
#                 logger.info(f"Processing PDF: {file_name}")

#                 text = self.read_text(pdf_path)

#                 if not text.strip():
#                     logger.warning(f"Skipping empty PDF: {file_name}")
#                     continue

#                 chunks = self.chunk_text(text)

#                 if not chunks:
#                     logger.warning(f"No chunks created for: {file_name}")
#                     continue

#                 self.store_in_vector_db(chunks)

#         logger.info("All PDFs loaded successfully")


#     def ask_question(self, question):
#         logger.info(f"Received question: {question}")

#         if self.vector_db is None:
#             raise ValueError("Vector DB not initialized")

#         retriever = self.vector_db.as_retriever()

#         rag_chain = (
#             {
#                 "content": retriever,
#                 "question": RunnablePassthrough()
#             }
#             | self.prompt
#             | self.llm
#             | self.parser
#         )

#         return rag_chain.invoke(question)


from utils.simple_rag import SimpleRAG

if __name__ == "__main__":
    rag = SimpleRAG()

#     pdf_path = "C:\\Users\\nimma\\OneDrive\\Desktop\\RAG-Pipeline\\uploads\\Attention All You Need.pdf"
#     text = rag.read_text(pdf_path)
#     chunks = rag.chunk_text(text)
#     rag.store_in_vector_db(chunks)

#     question = "What is the document about?"
#     answer = rag.ask_question(question)

#     print("\nAnswer:")
#     print(answer)
