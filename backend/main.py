from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import tempfile
import os
import json

from gemini_ai import analyze_with_gemini, get_genai_client
from resume_parser import extract_text_from_pdf, get_resume_summary
from skill_extractor import extract_skills
from similarity import (
    calculate_similarity_score,
    find_missing_skills,
    calculate_match_breakdown,
    generate_suggestions,
    format_score_feedback
)

app = FastAPI(title="AI Resume Analyzer API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExampleResponse(BaseModel):
    description: str


class AutoJobProfile(BaseModel):
    title: str = Field(..., description="Detected or inferred job title")
    description: str = Field(..., description="Generated concise job description")


@app.get("/")
async def root():
    return {"message": "AI Resume Analyzer backend is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/example-job", response_model=ExampleResponse)
async def get_example_job(title: Optional[str] = Query(None)):
    if not title:
        example = """Requirements:
- Experience with HTML, CSS, and JavaScript
- Basic knowledge of React.js or Vue.js
- Familiarity with Git and GitHub"""
        return ExampleResponse(description=example)

    try:
        client = get_genai_client()

        prompt = f"""
You are an expert HR recruiter. Generate a realistic, concise job description for the role of "{title}".

Return a concise response in plain text with:
1. Role Overview
2. Key Requirements / Skills (3-5 bullet points)

Keep it short and professional.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        description = response.text.strip() if response.text else f"Looking for a skilled {title}."

        return ExampleResponse(description=description)

    except Exception as e:
        print(f"Example job generation error: {str(e)}")
        fallback = f"""Role Overview:
Looking for a skilled {title}.

Requirements:
- Relevant technical knowledge
- Problem-solving ability
- Good communication skills
- Ability to work in a team"""
        return ExampleResponse(description=fallback)


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    manual_title: str = Form("")
):
    temp_file_path = None

    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        resume_text = extract_text_from_pdf(temp_file_path)

        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        resume_summary = get_resume_summary(resume_text)

        resume_skill_data = extract_skills(resume_text)
        job_skill_data = extract_skills(job_description)

        resume_skills = resume_skill_data.get("all", [])
        job_skills = job_skill_data.get("all", [])

        match_score = calculate_similarity_score(
            resume_text=resume_text,
            job_description=job_description,
            resume_skills=resume_skills,
            job_skills=job_skills
        )

        missing_skills = find_missing_skills(resume_skills, job_skills)

        breakdown = calculate_match_breakdown(
            resume_skills=resume_skills,
            job_skills=job_skills,
            match_score=match_score
        )

        suggestions = generate_suggestions(missing_skills, match_score)
        score_feedback = format_score_feedback(match_score)

        ai_result = analyze_with_gemini(
            resume_text=resume_text,
            job_description=job_description,
            manual_title=manual_title
        )

        auto_job_profile = None
        try:
            client = get_genai_client()

            prompt = f"""
Analyze this resume and infer the most suitable job profile.

Resume:
{resume_text[:3000]}

Return valid JSON with this exact structure:
{{
  "title": "Suitable Job Title",
  "description": "Short and professional job description"
}}
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            raw_text = response.text.strip() if response.text else ""
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()

            auto_job_profile = json.loads(clean_text)

        except Exception as e:
            print(f"Auto job profile generation error: {str(e)}")
            auto_job_profile = {
                "title": manual_title if manual_title else "General Candidate Profile",
                "description": "Auto-generated profile is temporarily unavailable."
            }

        return {
            "success": True,
            "resume_summary": resume_summary,
            "resume_skills": resume_skill_data,
            "job_skills": job_skill_data,
            "match_score": match_score,
            "score_feedback": score_feedback,
            "missing_skills": missing_skills,
            "breakdown": breakdown,
            "suggestions": suggestions,
            "ai_analysis": ai_result,
            "auto_job_profile": auto_job_profile
        }

    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        print(f"Upload resume error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)