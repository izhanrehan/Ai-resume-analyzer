# backend/gemini_ai.py

from google import genai
import os
import json


def get_genai_client():
    """
    Create Gemini client safely at runtime, not on module import.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing")

    return genai.Client(api_key=api_key)


def analyze_with_gemini(resume_text: str, job_description: str, manual_title: str = ""):
    """
    Uses Google GenAI to detect candidate role and compare it with the Job description.
    """
    try:
        client = get_genai_client()

        role_logic = (
            f"Target Role specified by Recruiter: {manual_title}"
            if manual_title
            else "Detect the candidate's primary job profile/title from the resume text."
        )

        prompt = f"""
Compare the Resume and Job Description. Keep calculations tight and FAST.

Instruction: {role_logic}

Resume text: {resume_text[:3000]}
Job Description: {job_description[:3000]}

Return ONLY a STRICT valid JSON object with this exact schema:
{{
  "detected_role": "Calculated profile title from the resume",
  "ai_summary": "Quick 1-2 sentence profile summary.",
  "context_match_score": 85,
  "context_feedback": "Brief feedback point.",
  "smart_suggestions": ["Actionable tip 1", "Actionable tip 2"],
  "missing_keywords_ai": ["KeywordA", "KeywordB"]
}}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        raw_text = response.text.strip()
        clean_text = raw_text.replace("```json", "").replace("```", "").strip()

        return json.loads(clean_text)

    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return get_fallback_data()


def get_fallback_data():
    return {
        "detected_role": "Standard Profile",
        "ai_summary": "Traditional keyword analysis completed.",
        "context_match_score": 0,
        "context_feedback": "AI analysis temporarily unavailable.",
        "smart_suggestions": ["Ensure skills are updated manually."],
        "missing_keywords_ai": []
    }