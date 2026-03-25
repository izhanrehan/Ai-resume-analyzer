"""
Resume Parser Module
Handles PDF text extraction from resumes
"""

import pdfplumber
from typing import Optional


def extract_text_from_pdf(file_path: str) -> Optional[str]:
    """
    Extract text from a PDF file.
    """
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip() if text else None
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return None


def clean_text(text: str) -> str:
    """
    Clean and normalize extracted text.
    """
    if not text:
        return ""

    text = " ".join(text.split())
    return text.lower()


def get_resume_summary(text: str, word_limit: int = 100) -> str:
    """
    Generate a short summary from resume text.
    """
    if not text:
        return ""

    sentences = text.split(".")
    summary = ". ".join([s.strip() for s in sentences[:3] if s.strip()])

    if summary and not summary.endswith("."):
        summary += "."

    words = summary.split()
    if len(words) > word_limit:
        summary = " ".join(words[:word_limit]) + "..."

    return summary