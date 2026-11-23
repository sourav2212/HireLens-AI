
import math

from services.semantic_matcher import (
    calculate_similarity
)


SCORING_WEIGHTS = {
    "semantic": 35,
    "skills": 35,
    "experience": 20,
    "education": 10,
}

REQUIRED_SKILL_WEIGHT = 80
PREFERRED_SKILL_WEIGHT = 20


def normalize_text(value):
    return " ".join(
        str(value).lower().split()
    )


def normalize_items(items):
    normalized = {}

    for item in items or []:
        key = normalize_text(item)

        if key:
            normalized[key] = str(item).strip()

    return normalized


def clamp_score(value):
    if value is None:
        return None

    try:
        score = float(value)
    except (TypeError, ValueError):
        return None

    if not math.isfinite(score):
        return None

    return max(0.0, min(100.0, score))


def calculate_skill_match(
    required_skills,
    candidate_skills
):
    """
    Return match percentage and matched/
    undetected skill lists.
    """

    required = normalize_items(required_skills)
    candidate = normalize_items(candidate_skills)

    required_keys = set(required)
    candidate_keys = set(candidate)

    matched_keys = required_keys & candidate_keys
    missing_keys = required_keys - candidate_keys

    matched = sorted(
        [required[key] for key in matched_keys],
        key=str.lower
    )

    missing = sorted(
        [required[key] for key in missing_keys],
        key=str.lower
    )

    if not required_keys:
        return None, matched, missing

    score = (
        len(matched_keys) / len(required_keys)
    ) * 100

    return score, matched, missing


def calculate_candidate_score(
    job_description,
    resume_text,
    candidate,
    requirements
):
    # ----------------------------------
    # 1. Semantic similarity
    # ----------------------------------

    semantic_score = clamp_score(
        calculate_similarity(
            job_description,
            resume_text
        )
    )

    # ----------------------------------
    # 2. Required skill matching
    # ----------------------------------

    required_skills = requirements.get(
        "required_skills", []
    )

    preferred_skills = requirements.get(
        "preferred_skills", []
    )

    candidate_skills = candidate.get(
        "skills", []
    )

    (
        required_skills_score,
        matched_required,
        missing_required,
    ) = calculate_skill_match(
        required_skills,
        candidate_skills
    )

    # ----------------------------------
    # 3. Preferred skill matching
    # ----------------------------------

    (
        preferred_skills_score,
        matched_preferred,
        missing_preferred,
    ) = calculate_skill_match(
        preferred_skills,
        candidate_skills
    )

    # ----------------------------------
    # 4. Combined skill score
    # ----------------------------------

    skill_components = [
        (
            required_skills_score,
            REQUIRED_SKILL_WEIGHT
        ),
        (
            preferred_skills_score,
            PREFERRED_SKILL_WEIGHT
        ),
    ]

    skill_weighted_total = 0
    available_skill_weight = 0

    for score, weight in skill_components:
        if score is not None:
            skill_weighted_total += score * weight
            available_skill_weight += weight

    skills_score = (
        skill_weighted_total / available_skill_weight
        if available_skill_weight > 0
        else None
    )

    # ----------------------------------
    # 5. Experience
    # ----------------------------------

    # We do not have reliable verified
    # professional experience data yet.
    experience_score = None

    # ----------------------------------
    # 6. Education
    # ----------------------------------

    required_education = normalize_items(
        requirements.get("education", [])
    )

    candidate_education = normalize_items(
        candidate.get("education", [])
    )

    required_keys = set(required_education)
    candidate_keys = set(candidate_education)

    education_score = None

    if required_keys:
        education_score = (
            len(required_keys & candidate_keys)
            / len(required_keys)
        ) * 100

    # ----------------------------------
    # 7. Final weighted score
    # ----------------------------------

    components = {
        "semantic": semantic_score,
        "skills": skills_score,
        "experience": experience_score,
        "education": education_score,
    }

    weighted_total = 0.0
    available_weight = 0.0

    for component, score in components.items():
        if score is not None:
            weight = SCORING_WEIGHTS[component]

            weighted_total += score * weight
            available_weight += weight

    final_score = (
        weighted_total / available_weight
        if available_weight > 0
        else 0.0
    )

    # ----------------------------------
    # 8. Explainable score breakdown
    # ----------------------------------

    score_breakdown = {}

    for component, score in components.items():
        weight = SCORING_WEIGHTS[component]

        if score is None:
            score_breakdown[component] = {
                "score": None,
                "weight": weight,
                "effective_weight": 0,
                "contribution": 0,
                "status": "not_evaluated",
            }

        else:
            effective_weight = (
                weight / available_weight
                if available_weight > 0
                else 0
            )

            score_breakdown[component] = {
                "score": round(score, 2),
                "weight": weight,
                "effective_weight": round(
                    effective_weight * 100, 2
                ),
                "contribution": round(
                    score * effective_weight, 2
                ),
                "status": "evaluated",
            }

    # ----------------------------------
    # 9. API response
    # ----------------------------------

    return {
        "final_score": round(final_score, 2),

        "semantic_score": (
            round(semantic_score, 2)
            if semantic_score is not None
            else None
        ),

        "skills_score": (
            round(skills_score, 2)
            if skills_score is not None
            else None
        ),

        "required_skills_score": (
            round(required_skills_score, 2)
            if required_skills_score is not None
            else None
        ),

        "preferred_skills_score": (
            round(preferred_skills_score, 2)
            if preferred_skills_score is not None
            else None
        ),

        "experience_score": experience_score,

        "education_score": (
            round(education_score, 2)
            if education_score is not None
            else None
        ),

        # Existing fields preserved for frontend
        "matched_skills": sorted(
            set(matched_required + matched_preferred),
            key=str.lower
        ),

        "missing_skills": sorted(
            set(missing_required + missing_preferred),
            key=str.lower
        ),

        # New detailed skill fields
        "matched_required_skills": matched_required,
        "missing_required_skills": missing_required,

        "matched_preferred_skills": matched_preferred,
        "missing_preferred_skills": missing_preferred,

        "score_breakdown": score_breakdown,

        "scoring_note": (
            "Estimated resume-to-job alignment. "
            "Required skills receive 80% of the "
            "skills component when both skill "
            "categories are present. "
            "Experience is not evaluated. "
            "Undetected skills are not verified "
            "skill gaps."
        ),
    }
