# import os
# from PyPDF2 import PdfReader
# from .logger import logger

# def read_pdf_text(pdf_path, output_dir="extracted_text"):
#     logger.info(f"Reading PDF: {pdf_path}")
#     reader = PdfReader(pdf_path)
#     text = ""

#     for i, page in enumerate(reader.pages):
#         page_text = page.extract_text() or ""
#         text += page_text + "\n"
#         logger.debug(f"Processed page {i+1}")

#     logger.info(f"Finished reading PDF ({len(reader.pages)} pages)")

#     # Save to file
#     if output_dir:
#         try:
#             os.makedirs(output_dir, exist_ok=True)
#             base_name = os.path.basename(pdf_path)
#             file_name = os.path.splitext(base_name)[0] + ".txt"
#             output_path = os.path.join(output_dir, file_name)
            
#             with open(output_path, "w", encoding="utf-8") as f:
#                 f.write(text)
#             logger.info(f"Saved extracted text to {output_path}")
#             print(f"DEBUG: Saved to {output_path}")
#         except Exception as e:
#             logger.error(f"Failed to save extracted text: {e}")
#             print(f"DEBUG: Failed to save: {e}")

#     return text

# import os
# from PyPDF2 import PdfReader
# from .logger import logger

# def read_pdf_text(pdf_path, output_dir="extracted_text"):
#     logger.info(f"Reading PDF: {pdf_path}")
#     reader = PdfReader(pdf_path)
#     text = ""

#     for i, page in enumerate(reader.pages):
#         page_text = page.extract_text() or ""
#         text += page_text + "\n"
#         logger.debug(f"Processed page {i+1}")

#     logger.info(f"Finished reading PDF ({len(reader.pages)} pages)")

#     os.makedirs(output_dir, exist_ok=True)
#     output_path = os.path.join(output_dir, "combined.txt")

#     with open(output_path, "a", encoding="utf-8") as f:
#         f.write(f"\n\n===== FILE: {os.path.basename(pdf_path)} =====\n\n")
#         f.write(text)

#     logger.info(f"Appended extracted text to {output_path}")
#     return text


# from .logger import logger
# import pymupdf4llm 

# def read_pdf_text(pdf_path):
#     logger.info(f"Reading PDF: {pdf_path}")
#     text = pymupdf4llm.to_markdown(pdf_path)
#     logger.info(f"Finished reading PDF")
#     return text

# from .logger import logger
# from llama_parse import LlamaParse 
# import os
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnablePassthrough
# from langchain_community.llms import Ollama
# os.environ["LLAMA_CLOUD_API_KEY"] = "llx-oHKl7bqJ8b5HqVVuLqHsBn4LNRDOY5H2yGsLI1oOYELFZqWH"

# def read_pdf_text(pdf_path,output_dir="extracted_text"):
#     llm = Ollama(model="qwen3:1.7b")
#     logger.info(f"Reading PDF: {pdf_path}")
#     document = LlamaParse(
#         result_type="markdown",
#     ).load_data(pdf_path)
#     logger.info(f"Finished reading PDF")

#     text = "\n\n".join([page.text for page in document])

#     os.makedirs(output_dir,exist_ok=True)
#     output_path = os.path.join(output_dir,"combined.txt")

#     with open(output_path,"a",encoding="utf-8") as f:
#         f.write(f"\n\n =====File: {os.path.basename(pdf_path)} \n\n")
#         f.write(text)
#         f.write("\n\n")
#     logger.info(f"Appended extracted text to {output_path}")

#     prompt = PromptTemplate(
        # template = """
        # You are a financial document summarization assistant. Your task is to summarize the provided financial tables in text format.

        # Content:
        # {content}

        # Instructions:
        # - Summarize the tables in a clear and concise manner.
        # - Highlight the key financial information.
        # - Keep the summary professional and easy to understand.
        # """,
#         input_variables=["content"]
#     )
#     parser = StrOutputParser()

#     chain = (
#          prompt
#         | llm
#         | parser
#     )

#     with open(output_path,"a",encoding="utf-8") as f:
#         f.write(f"\n\n =====Summary of {os.path.basename(pdf_path)} \n\n")
#         f.write(chain.invoke({"content": text}))
#         f.write("\n\n")
#     logger.info(f"Appended summarized text to {output_path}")
#     return text


from .logger import logger
from llama_parse import LlamaParse 
import os
import re
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.llms import Ollama

os.environ["LLAMA_CLOUD_API_KEY"] = "Your api key"


def extract_markdown_tables(md_text):

    table_pattern = r"(?:\|.*?\|\s*\n)+"
    matches = re.findall(table_pattern, md_text)

    return matches


def read_pdf_text(pdf_path, output_dir="extracted_text"):
    llm = Ollama(model="qwen3:1.7b")

    logger.info(f"Reading PDF: {pdf_path}")
    document = LlamaParse(result_type="markdown").load_data(pdf_path)
    logger.info("Finished reading PDF")

    text = "\n\n".join([page.text for page in document])

    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "combined.txt")

    with open(output_path, "a", encoding="utf-8") as f:
        f.write(f"\n\n===== File: {os.path.basename(pdf_path)} =====\n\n")
        f.write(text + "\n\n")

    logger.info(f"Appended extracted text to {output_path}")

    tables = extract_markdown_tables(text)

    logger.info(f"Found {len(tables)} tables.")

    prompt = PromptTemplate(
        template = """
        You are a financial document summarization assistant. Your task is to summarize the provided financial tables in text format.

        Content:
        {table}

        Instructions:
        - Summarize the tables in a clear and concise manner.
        - Highlight the key financial information.
        - Keep the summary professional and easy to understand.
        """,
        input_variables=["table"],
    )

    parser = StrOutputParser()
    chain = prompt | llm | parser

    with open(output_path, "a", encoding="utf-8") as f:
        f.write(f"\n===== Table Summaries for {os.path.basename(pdf_path)} =====\n\n")

        for i, tbl in enumerate(tables, 1):
            f.write(f"\n--- TABLE {i} ---\n")
            f.write(tbl + "\n")

            summary = chain.invoke({"table": tbl})

            f.write(f"\nSummary {i}:\n{summary}\n")

    logger.info(f"Added table summaries to {output_path}")

    return text
