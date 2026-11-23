
from fastapi import APIRouter
from pydantic import BaseModel

from services.jd_extractor import extract_job_requirements

router = APIRouter()


class JobDescriptionRequest(BaseModel):
    job_description: str


@router.post("/analyze-jd")
def analyze_job_description(request: JobDescriptionRequest):

    # Get the job description from the request
    jd_text = request.job_description

    # Extract job requirements
    requirements = extract_job_requirements(jd_text)

    # Return the result
    return {
        "message": "Job description analyzed successfully",
        "requirements": requirements
    }
