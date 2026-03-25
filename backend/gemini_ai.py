# 📂 backend/gemini_ai.py
from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def analyze_with_gemini(resume_text: str, job_description: str, manual_title: str = ""):
    """
    Uses Google GenAI to detect candidate role and compare it with the Job description.
    """
    if not GEMINI_API_KEY:
        print("⚠️ GEMINI_API_KEY is missing in your .env file!")
        return get_fallback_data()

    try:
        client = genai.Client()
        
        # 🧠 Context parsing logic
        role_logic = f"Target Role specified by Recruiter: {manual_title}" if manual_title else "Detect the candidate's primary job profile/title from the resume text."
        
        prompt = f"""
        Compare the Resume and Job Description. Keep calculations tight and FAST.
        
        Instruction: {role_logic}
        
        Resume text: {resume_text[:3000]}
        Job Description: {job_description[:3000]}
        
        Return a STRICT pure JSON string with the following EXACT schema format:
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
            model='gemini-2.5-flash',
            contents=prompt,
        )

        clean_text = response.text.replace("```json", "").replace("```", "").strip()
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