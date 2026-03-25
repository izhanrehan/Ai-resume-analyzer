"""
Skill Extractor Module
Extracts technical and soft skills from text using regex-based exact matching.
"""

import re
from typing import Dict, List


TECHNICAL_SKILLS = [
    "html", "css", "javascript", "typescript", "react", "next.js", "nextjs",
    "redux", "tailwind", "bootstrap", "node.js", "nodejs", "express",
    "mongodb", "mysql", "postgresql", "firebase", "git", "github",
    "rest api", "api", "graphql", "figma", "responsive design",
    "web development", "frontend", "backend", "full stack", "vite",
    "npm", "yarn", "zustand", "react router", "material ui", "mui",
    "shadcn", "docker", "aws", "devops", "python", "java", "c++",
    "go", "php", "linux"
]

SOFT_SKILLS = [
    "communication", "teamwork", "leadership", "problem solving",
    "time management", "adaptability", "critical thinking",
    "collaboration", "creativity", "attention to detail"
]


def build_skill_patterns(skills: List[str]) -> Dict[str, re.Pattern]:
    """
    Build regex patterns for exact/phrase skill matching.
    """
    patterns = {}

    for skill in skills:
        escaped = re.escape(skill.lower())

        # make spaces flexible
        escaped = escaped.replace(r"\ ", r"\s+")

        # boundary-safe regex
        pattern = re.compile(rf"(?<!\w){escaped}(?!\w)", re.IGNORECASE)
        patterns[skill] = pattern

    return patterns


TECH_PATTERNS = build_skill_patterns(TECHNICAL_SKILLS)
SOFT_PATTERNS = build_skill_patterns(SOFT_SKILLS)


def extract_skills(text: str) -> Dict[str, List[str]]:
    """
    Extract technical and soft skills from text.
    Returns:
        {
            "technical": [...],
            "soft": [...],
            "all": [...]
        }
    """
    if not text:
        return {"technical": [], "soft": [], "all": []}

    text_lower = text.lower()

    extracted_technical = set()
    extracted_soft = set()

    for skill, pattern in TECH_PATTERNS.items():
        if pattern.search(text_lower):
            extracted_technical.add(skill)

    for skill, pattern in SOFT_PATTERNS.items():
        if pattern.search(text_lower):
            extracted_soft.add(skill)

    return {
        "technical": sorted(list(extracted_technical)),
        "soft": sorted(list(extracted_soft)),
        "all": sorted(list(extracted_technical.union(extracted_soft)))
    }