
from io import BytesIO
from pypdf import PdfReader
from docx import Document


def extract_resume_text(file_bytes: bytes, filename: str) -> str:

    if filename.lower().endswith(".pdf"):
        pdf = PdfReader(BytesIO(file_bytes))

        text = ""

        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"

        return text.strip()

    elif filename.lower().endswith(".docx"):
        document = Document(BytesIO(file_bytes))

        paragraphs = []

        for paragraph in document.paragraphs:
            paragraphs.append(paragraph.text)

        return "\n".join(paragraphs).strip()

    else:
        raise ValueError("Unsupported file format")
