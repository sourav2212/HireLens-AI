
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from services.resume_parser import extract_resume_text
from services.candidate_extractor import extract_candidate_details
from services.jd_extractor import extract_job_requirements
from services.ranking_engine import calculate_candidate_score


router = APIRouter()

ALLOWED_EXTENSIONS = (".pdf", ".docx")

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per resume
MAX_FILES = 20


@router.post("/rank-candidates")
async def rank_candidates(
    job_description: str = Form(...),
    files: list[UploadFile] = File(...),
):
    """
    Analyze multiple resumes against a job description.

    Returns:
    - Ranked candidates
    - Individual matching scores
    - Explainable score breakdown
    - Matched and undetected skills
    - Errors for files that could not be processed
    """

    # ---------------------------------------
    # 1. Validate inputs
    # ---------------------------------------

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty",
        )

    if not files:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least one resume",
        )

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {MAX_FILES} resumes allowed per analysis",
        )

    # ---------------------------------------
    # 2. Extract job requirements
    # ---------------------------------------

    try:
        requirements = extract_job_requirements(
            job_description
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Could not analyze the job description",
        )

    ranked_candidates = []
    failed_files = []

    # ---------------------------------------
    # 3. Process resumes individually
    # ---------------------------------------

    for file in files:
        filename = file.filename or "unnamed_file"

        try:
            # Validate extension
            if not filename.lower().endswith(
                ALLOWED_EXTENSIONS
            ):
                raise ValueError(
                    "Only PDF and DOCX files are supported"
                )

            # Read file with a size limit
            file_bytes = await file.read(
                MAX_FILE_SIZE + 1
            )

            if len(file_bytes) > MAX_FILE_SIZE:
                raise ValueError(
                    "File exceeds the 10 MB limit"
                )

            if not file_bytes:
                raise ValueError(
                    "Uploaded file is empty"
                )

            # Extract resume text
            resume_text = extract_resume_text(
                file_bytes,
                filename,
            )

            if not resume_text or not resume_text.strip():
                raise ValueError(
                    "No readable text found in resume"
                )

            # Extract candidate information
            candidate = extract_candidate_details(
                resume_text
            )

            # Calculate matching scores
            scoring = calculate_candidate_score(
                job_description,
                resume_text,
                candidate,
                requirements,
            )

            # Include all scoring details
            ranked_candidates.append({
                "filename": filename,
                "candidate": candidate,
                **scoring,
            })

        except Exception as error:
            # Do not expose internal stack traces
            # or implementation details to clients.
            if isinstance(error, ValueError):
                reason = str(error)
            else:
                reason = "Could not read or analyze this resume"

            failed_files.append({
                "filename": filename,
                "error": reason,
            })

        finally:
            await file.close()

    # ---------------------------------------
    # 4. Handle unsuccessful analysis
    # ---------------------------------------

    if not ranked_candidates:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "No resumes could be analyzed",
                "failed_files": failed_files,
            },
        )

    # ---------------------------------------
    # 5. Rank candidates
    # ---------------------------------------

    ranked_candidates.sort(
        key=lambda item: item["final_score"],
        reverse=True,
    )

    for index, candidate in enumerate(
        ranked_candidates,
        start=1,
    ):
        candidate["rank"] = index

    # ---------------------------------------
    # 6. Return API response
    # ---------------------------------------

    return {
        "message": "Candidates ranked successfully",
        "total_candidates": len(ranked_candidates),
        "total_uploaded": len(files),
        "failed_count": len(failed_files),
        "failed_files": failed_files,
        "job_requirements": requirements,
        "ranked_candidates": ranked_candidates,
    }
