
from sentence_transformers import SentenceTransformer, util

# Load our pretrained AI model
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_similarity(job_description: str, resume_text: str):

    # Convert the job description into numbers
    jd_embedding = model.encode(
        job_description,
        convert_to_tensor=True
    )

    # Convert the resume into numbers
    resume_embedding = model.encode(
        resume_text,
        convert_to_tensor=True
    )

    # Compare both embeddings
    similarity = util.cos_sim(
        jd_embedding,
        resume_embedding
    )

    # Convert the result into a percentage-like score
    score = max(0.0, min(100.0, similarity.item() * 100))

    return round(score, 2)
