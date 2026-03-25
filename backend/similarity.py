"""
Similarity Module
Calculates match score between resume and job description using exact normalized skill matching.
"""

from typing import List, Dict


def normalize_skills(skills: List[str]) -> set:
    """
    Normalize skills by trimming spaces and converting to lowercase.
    """
    return {s.strip().lower() for s in (skills or []) if s and s.strip()}


def calculate_similarity_score(
    resume_text: str,
    job_description: str,
    resume_skills: List[str] = None,
    job_skills: List[str] = None
) -> float:
    """
    Calculate similarity score based on exact skill overlap.
    Example:
        9 matched out of 10 job skills = 90%
    """
    try:
        resume_set = normalize_skills(resume_skills)
        job_set = normalize_skills(job_skills)

        if not job_set:
            return 0.0

        matched_skills = resume_set.intersection(job_set)
        score = (len(matched_skills) / len(job_set)) * 100

        return round(score, 2)

    except Exception as e:
        print(f"Error calculating similarity: {str(e)}")
        return 0.0


def find_missing_skills(resume_skills: List[str], job_skills: List[str]) -> List[str]:
    """
    Find skills present in job description but missing from resume.
    """
    resume_set = normalize_skills(resume_skills)
    missing = []

    for skill in job_skills or []:
        if skill.strip().lower() not in resume_set:
            missing.append(skill)

    return missing[:10]


def calculate_match_breakdown(
    resume_skills: List[str],
    job_skills: List[str],
    match_score: float
) -> Dict:
    """
    Calculate detailed match breakdown.
    """
    resume_set = normalize_skills(resume_skills)
    job_set = normalize_skills(job_skills)

    matched = resume_set.intersection(job_set)
    missing = job_set - matched
    extra = resume_set - job_set

    return {
        "matched_skills": sorted(list(matched)),
        "missing_skills": sorted(list(missing)),
        "extra_skills": sorted(list(extra)),
        "match_percentage": round(match_score, 2),
        "total_job_skills": len(job_set),
        "matched_count": len(matched)
    }


def generate_suggestions(missing_skills: List[str], match_score: float) -> List[str]:
    """
    Generate practical suggestions based on missing skills and score.
    """
    suggestions = []

    if match_score < 40:
        suggestions.append("Your resume has a low match with this job. Add more role-specific technical skills and projects.")
    elif match_score < 70:
        suggestions.append("You have some relevant experience, but important skills are still missing.")
    else:
        suggestions.append("Your profile is a good match. A few improvements can make it stronger.")

    if missing_skills:
        top_missing = missing_skills[:3]
        suggestions.append(f"Try adding or strengthening these skills: {', '.join(top_missing)}")

    suggestions.extend([
        "Quantify achievements with metrics, for example: Improved performance by 30%",
        "Use strong action verbs to describe your work",
        "Add relevant tools, frameworks, certifications, and real projects"
    ])

    return suggestions


def format_score_feedback(score: float) -> str:
    """
    Get feedback message based on match score.
    """
    if score >= 75:
        return "Excellent match! You have most of the required skills."
    elif score >= 55:
        return "Good match! You meet many of the requirements."
    elif score >= 35:
        return "Fair match! Consider improving the missing skills."
    else:
        return "Low match. Significant skill development needed."