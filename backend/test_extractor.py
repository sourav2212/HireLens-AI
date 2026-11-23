
from services.candidate_extractor import (
    extract_candidate_details
)

sample_resume = """
Rahul Sharma

Email: rahul@example.com
Phone: +91 9876543210

Education:
Bachelor of Technology in Computer Science

Technical Skills:
Python, ReactJS, NodeJS, FastAPI,
MongoDB, AWS, Docker, sklearn

Projects:
Built a RAG chatbot using LangChain.

Experience:
Software Development Intern
"""

result = extract_candidate_details(sample_resume)

for key, value in result.items():
    print(f"{key}: {value}")
