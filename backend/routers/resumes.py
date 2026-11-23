
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.resume_parser import extract_resume_text
from services.candidate_extractor import extract_candidate_details

router = APIRouter()

ALLOWED_EXTENSIONS = (".pdf", ".docx")


@router.post("/upload-resumes")
async def upload_resumes(files: list[UploadFile] = File(...)):

    uploaded_resumes = []

    for file in files:
        filename = file.filename or ""

        if not filename.lower().endswith(ALLOWED_EXTENSIONS):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {filename}"
            )

        try:
            # Step 1: Read the uploaded resume
            file_bytes = await file.read()

            # Step 2: Extract text from PDF/DOCX
            extracted_text = extract_resume_text(
                file_bytes, filename
            )

            # Step 3: Extract candidate information
            candidate_details = extract_candidate_details(
                extracted_text
            )

            # Step 4: Store the results
            uploaded_resumes.append({
                "filename": filename,
                "candidate": candidate_details,
                "extracted_text": extracted_text,
                "characters": len(extracted_text)
            })

        except Exception as error:
            raise HTTPException(
                status_code=400,
                detail=f"Could not process {filename}: {error}"
            )

        finally:
            await file.close()

    return {
        "message": "Resumes processed successfully",
        "total_resumes": len(uploaded_resumes),
        "resumes": uploaded_resumes
    }
