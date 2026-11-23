
from services.jd_extractor import (
    extract_job_requirements
)

job_description = """
We are hiring a Junior AI Engineer.

Required Skills:
Python, FastAPI, ReactJS, Machine Learning,
RAG, LangChain, Docker, AWS.

Experience:
0-2 years of experience.
Freshers are welcome.

Education:
Bachelor of Technology in Computer Science.
"""

result = extract_job_requirements(job_description)

print("Required Skills:", result["required_skills"])
print("Minimum Experience:", result["minimum_experience"])
print("Education:", result["education"])
