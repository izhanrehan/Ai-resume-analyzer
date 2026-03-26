from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import tempfile
import os
import json

# Standard top-level import for Google GenAI
from google import genai

# Custom modules imports
from gemini_ai import analyze_with_gemini
from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from similarity import (
    calculate_similarity_score,
    find_missing_skills,
    calculate_match_breakdown,
    format_score_feedback
)

# 🚀 1. App initialization
app = FastAPI(title="AI Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Client Instance for Vercel Serverless efficiency
client = genai.Client()

# 📝 2. Schema Models
class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    job_title: Optional[str] = ""

class AnalysisResult(BaseModel):
    resume_summary: str
    resume_skills: dict
    job_skills: dict
    match_score: float
    match_feedback: str
    missing_skills: List[str]
    suggestions: List[str]
    match_breakdown: dict

class ExampleResponse(BaseModel):
    description: str

# Schema for Strict Structured AI Output
class AutoJobProfile(BaseModel):
    detected_title: str = Field(description="The standard professional job title inferred from the resume context.")
    generated_jd: str = Field(description="Standard concise job requirements and description matching the profile.")


# 🌐 3. API Routes

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is LIVE on Vercel! 🚀🔥"}


@app.get("/example-job", response_model=ExampleResponse)
async def get_example_job(title: Optional[str] = Query(None)):
    if not title:
        example = """Requirements:
- Experience with HTML, CSS, and JavaScript
- Basic knowledge of React.js or Vue.js
- Familiarity with Git and GitHub"""
        return ExampleResponse(description=example)

    try:
        prompt = f"""
        You are an expert HR recruiter. Generate a realistic, concise job description (JD) 
        for the role of '{title}'. 
        Include:
        - Role Overview
        - Key Requirements / Skills (3-4 bullet points)
        Do not make it too long.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        return ExampleResponse(description=response.text.strip())

    except Exception as e:
        fallback = f"Role Overview: Looking for a skilled {title}.\n\nRequirements:\n- Relevant tech stack experience.\n- Problem-solving skills.\n- Good communication."
        return ExampleResponse(description=fallback)


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    tmp_file_path = None
    try:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Extract Text
        resume_text = extract_text_from_pdf(tmp_file_path)
        
        prompt = f"""
        You are an expert recruiter. Read this extracted resume text and automatically 
        infer the absolute best matching standard Job Title and matching Job Description for this candidate.
        
        Resume: {resume_text[:3000]}
        """

        # Using Structured Output to prevent JSON Parsing Errors
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={"response_mime_type": "application/json", "response_schema": AutoJobProfile},
        )

        try:
            ai_data = json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback if AI output is slightly distorted
            ai_data = {"detected_title": "Software Engineer", "generated_jd": "Extracted profile was not perfectly parsable."}

        return {
            "success": True, 
            "resume_text": resume_text,
            "auto_title": ai_data.get("detected_title", "Software Engineer"),
            "auto_jd": ai_data.get("generated_jd", "Standard responsibilities based on profile context.")
        }
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vercel Serverless Trace: {str(e)}")
    
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)


@app.post("/analyze-resume", response_model=AnalysisResult)
async def analyze_resume(request: AnalyzeRequest):
    try:
        resume_text = request.resume_text
        job_description = request.job_description
        job_title = request.job_title

        context_description = job_description
        if job_title:
            context_description = f"Job Title: {job_title}\n\n{job_description}"

        ai_data = analyze_with_gemini(resume_text, context_description, job_title)

        resume_skills_dict = extract_skills(resume_text)
        job_skills_dict = extract_skills(context_description)
        
        resume_skills = resume_skills_dict.get('all', [])
        job_skills = job_skills_dict.get('all', [])
        
        match_score = calculate_similarity_score(
            resume_text=resume_text, 
            job_description=context_description, 
            resume_skills=resume_skills, 
            job_skills=job_skills
        )
        
        missing_skills = find_missing_skills(resume_skills, job_skills)
        match_breakdown = calculate_match_breakdown(resume_skills, job_skills, match_score)
        feedback = format_score_feedback(match_score)

        ai_missing = ai_data.get("missing_keywords_ai", [])
        combined_missing = list(set(missing_skills + ai_missing))[:10]

        return AnalysisResult(
            resume_summary=ai_data.get("ai_summary", "Summary failed to load."),
            resume_skills={
                "technical": resume_skills_dict.get('technical', [])[:10],
                "soft": resume_skills_dict.get('soft', [])[:5],
                "all": resume_skills[:15]
            },
            job_skills={
                "technical": job_skills_dict.get('technical', [])[:10],
                "soft": job_skills_dict.get('soft', [])[:5],
                "all": job_skills[:15]
            },
            match_score=match_score,
            match_feedback=feedback,
            missing_skills=combined_missing,
            suggestions=ai_data.get("smart_suggestions", []),
            match_breakdown=match_breakdown
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vercel Serverless Trace: {str(e)}")