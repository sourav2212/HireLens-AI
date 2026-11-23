
import re

from services.candidate_extractor import (
    extract_skills,
    extract_education,
)


REQUIRED_HEADINGS = [
    "required skills",
    "mandatory skills",
    "must have skills",
    "must-have skills",
    "essential skills",
    "technical requirements",
    "technical skills",
    "requirements",
]

PREFERRED_HEADINGS = [
    "preferred skills",
    "nice to have",
    "nice-to-have",
    "good to have",
    "good-to-have",
    "bonus skills",
    "desired skills",
    "additional skills",
]

OTHER_HEADINGS = [
    "about the role",
    "about us",
    "job description",
    "responsibilities",
    "key responsibilities",
    "education",
    "education requirements",
    "qualifications",
    "experience",
    "experience requirements",
    "ideal candidate",
    "benefits",
    "what we offer",
]


def normalize_heading(line):
    """
    Remove Markdown heading markers,
    numbering, and trailing colons.
    """
    line = line.strip()

    line = re.sub(r"^#{1,6}\s*", "", line)
    line = re.sub(r"^\d+[.)]\s*", "", line)
    line = re.sub(r"^\*{1,2}", "", line)
    line = re.sub(r"\*{1,2}:?\s*$", "", line)

    return line.strip().rstrip(":").strip().lower()


def get_section_type(line):
    """
    Determine whether a line is a recognized
    section heading.
    """
    heading = normalize_heading(line)

    if heading in REQUIRED_HEADINGS:
        return "required"

    if heading in PREFERRED_HEADINGS:
        return "preferred"

    if heading in OTHER_HEADINGS:
        return "other"

    return None


def extract_skill_categories(job_description):
    """
    Extract skills from required and preferred
    sections of a job description.

    Skills outside these sections are returned
    separately as other_mentioned_skills.
    """

    sections = {
        "required": [],
        "preferred": [],
        "other": [],
    }

    current_section = "other"

    for line in job_description.splitlines():
        stripped = line.strip()

        if not stripped:
            continue

        section_type = get_section_type(stripped)

        if section_type is not None:
            current_section = section_type
            continue

        sections[current_section].append(stripped)

    required = extract_skills(
        "\n".join(sections["required"])
    )

    preferred = extract_skills(
        "\n".join(sections["preferred"])
    )

    other = extract_skills(
        "\n".join(sections["other"])
    )

    # Required takes priority if a skill appears
    # in both required and preferred sections.
    required_set = set(required)

    preferred = [
        skill for skill in preferred
        if skill not in required_set
    ]

    preferred_set = set(preferred)

    other = [
        skill for skill in other
        if skill not in required_set
        and skill not in preferred_set
    ]

    # Fallback for JDs without recognized
    # required/preferred headings.
    if not required and not preferred:
        required = extract_skills(job_description)
        other = []

    return {
        "required_skills": required,
        "preferred_skills": preferred,
        "other_mentioned_skills": other,
    }


def extract_minimum_experience(text):
    """
    Extract the minimum years of experience
    mentioned in the job description.
    """

    text = text.lower()

    patterns = [
        (
            r"\b(\d+)\s*(?:-|–|—|to)\s*"
            r"\d+\s*(?:years?|yrs?)\b"
        ),
        (
            r"\b(?:minimum|min\.?|at least)\s*"
            r"(\d+)\s*\+?\s*(?:years?|yrs?)\b"
        ),
        (
            r"\b(\d+)\s*\+?\s*(?:years?|yrs?)"
            r"(?:\s+of)?\s+(?:professional\s+|"
            r"relevant\s+|work\s+)?experience\b"
        ),
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            return int(match.group(1))

    if re.search(
        r"\b(?:freshers?|entry.level)\b",
        text
    ):
        return 0

    return None


def extract_job_requirements(job_description):
    """
    Extract structured job requirements.
    """

    skills = extract_skill_categories(
        job_description
    )

    return {
        **skills,

        "minimum_experience": (
            extract_minimum_experience(
                job_description
            )
        ),

        "education": extract_education(
            job_description
        ),
    }
