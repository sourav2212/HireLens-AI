
from services.jd_extractor import (
    extract_job_requirements
)
from services.ranking_engine import (
    calculate_skill_match
)


jd = """
Junior AI Engineer

Required Skills:
- Python
- FastAPI
- Machine Learning
- SQL

Preferred Skills:
- ReactJS
- Docker
- AWS

Education Requirements:
Bachelor of Technology in Computer Science

Experience Requirements:
0-2 years of experience
"""


candidate_skills = [
    "Python",
    "FastAPI",
    "Machine Learning",
    "React",
    "Docker",
]


requirements = extract_job_requirements(jd)

required_score, matched_required, missing_required = (
    calculate_skill_match(
        requirements["required_skills"],
        candidate_skills
    )
)

preferred_score, matched_preferred, missing_preferred = (
    calculate_skill_match(
        requirements["preferred_skills"],
        candidate_skills
    )
)

combined_score = (
    required_score * 0.8
    + preferred_score * 0.2
)

print("Required:", requirements["required_skills"])
print("Preferred:", requirements["preferred_skills"])
print("Other:", requirements["other_mentioned_skills"])

print("Required score:", round(required_score, 2))
print("Preferred score:", round(preferred_score, 2))
print("Combined score:", round(combined_score, 2))

print("Matched required:", matched_required)
print("Undetected required:", missing_required)
print("Matched preferred:", matched_preferred)
print("Undetected preferred:", missing_preferred)

assert round(required_score, 2) == 75.0
assert round(preferred_score, 2) == 66.67
assert round(combined_score, 2) == 73.33

print("All tests passed!")
