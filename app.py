import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000"

st.set_page_config(page_title="Simple RAG App", layout="centered")
st.title("Simple RAG App")
st.subheader("Upload PDF")
uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")

if uploaded_file:
    with st.spinner("Uploading and processing PDF..."):
        files = {"file": uploaded_file}
        response = requests.post(f"{API_URL}/upload-pdf/", files=files)

        if response.status_code == 200:
            st.success("PDF processed successfully!")
        else:
            st.error("Failed to process PDF")

st.subheader("Ask a Question")
question = st.text_input("Enter your question")
if st.button("Ask"):
    if question:
        with st.spinner("Thinking..."):
            response = requests.post(
                f"{API_URL}/ask/",
                params={"question": question}
            )
            answer = response.json()["answer"]
            st.markdown("### Answer")
            st.write(answer)
    else:
        st.warning("Please enter a question")