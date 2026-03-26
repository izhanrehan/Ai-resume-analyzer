# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os

from resume_parser import extract_text_from_pdf, get_resume_summary
from skill_extractor import extract_skills
from similarity import (
    calculate_similarity_score,
    find_missing_skills,
    calculate_match_breakdown,
    generate_suggestions,
    format_score_feedback,
)
from gemini_ai import analyze_with_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later frontend domain bhi restrict kar sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Resume Analyzer backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    manual_title: str = Form("")
):
    temp_file_path = None

    try:
        # Save uploaded PDF temporarily
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".pdf"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Extract text
        resume_text = extract_text_from_pdf(temp_file_path)

        if not resume_text:
            return JSONResponse(
                status_code=400,
                content={"error": "Could not extract text from PDF"}
            )

        # Resume summary
        summary = get_resume_summary(resume_text)

        # Extract skills
        resume_skills_data = extract_skills(resume_text)
        job_skills_data = extract_skills(job_description)

        resume_skills = resume_skills_data.get("all", [])
        job_skills = job_skills_data.get("all", [])

        # Similarity score
        match_score = calculate_similarity_score(
            resume_text=resume_text,
            job_description=job_description,
            resume_skills=resume_skills,
            job_skills=job_skills,
        )

        # Missing skills
        missing_skills = find_missing_skills(resume_skills, job_skills)

        # Breakdown
        breakdown = calculate_match_breakdown(
            resume_skills=resume_skills,
            job_skills=job_skills,
            match_score=match_score,
        )

        # Suggestions
        suggestions = generate_suggestions(missing_skills, match_score)

        # Feedback
        feedback = format_score_feedback(match_score)

        # Gemini AI analysis
        ai_result = analyze_with_gemini(
            resume_text=resume_text,
            job_description=job_description,
            manual_title=manual_title,
        )

        return {
            "success": True,
            "resume_summary": summary,
            "resume_skills": resume_skills_data,
            "job_skills": job_skills_data,
            "match_score": match_score,
            "feedback": feedback,
            "missing_skills": missing_skills,
            "breakdown": breakdown,
            "suggestions": suggestions,
            "ai_analysis": ai_result,
        }

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)