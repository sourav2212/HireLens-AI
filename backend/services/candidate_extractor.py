
import re


# ---------------------------------------
# 1. Technical skills and their aliases
# ---------------------------------------

# Each key is the standardized skill name.
# Each value contains alternative spellings.

SKILL_ALIASES = {
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "C": ["c programming", "c language"],
    "C#": ["c#", "c sharp"],
    "JavaScript": ["javascript", "java script", "js"],
    "TypeScript": ["typescript", "type script", "ts"],

    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "Bootstrap": ["bootstrap"],

    "React": ["react", "reactjs", "react.js"],
    "Next.js": ["next.js", "nextjs"],
    "Angular": ["angular", "angularjs"],
    "Vue.js": ["vue", "vuejs", "vue.js"],

    "Node.js": ["node.js", "nodejs"],
    "Express.js": ["express.js", "expressjs"],
    "FastAPI": ["fastapi", "fast api"],
    "Django": ["django"],
    "Flask": ["flask"],
    "Spring Boot": ["spring boot", "springboot"],

    "SQL": ["sql"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MongoDB": ["mongodb", "mongo db"],
    "Redis": ["redis"],
    "SQLite": ["sqlite"],

    "AWS": ["aws", "amazon web services"],
    "Azure": ["microsoft azure", "azure"],
    "Google Cloud": ["google cloud", "gcp"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Linux": ["linux"],
    "Git": ["git"],
    "GitHub": ["github"],
    "GitLab": ["gitlab"],

    "Machine Learning": ["machine learning"],
    "Deep Learning": ["deep learning"],
    "Artificial Intelligence": [
        "artificial intelligence"
    ],
    "NLP": [
        "nlp",
        "natural language processing"
    ],
    "Computer Vision": ["computer vision"],

    "PyTorch": ["pytorch", "torch"],
    "TensorFlow": ["tensorflow"],
    "Scikit-Learn": [
        "scikit-learn",
        "scikit learn",
        "sklearn"
    ],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Matplotlib": ["matplotlib"],
    "OpenCV": ["opencv", "cv2"],

    "LangChain": ["langchain"],
    "LangGraph": ["langgraph"],
    "RAG": [
        "rag",
        "retrieval augmented generation",
        "retrieval-augmented generation"
    ],
    "LLM": [
        "llm",
        "large language model",
        "large language models"
    ],
    "Hugging Face": ["hugging face", "huggingface"],
    "Transformers": ["transformers"],

    "REST APIs": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis"
    ],
    "GraphQL": ["graphql"],
    "Postman": ["postman"],

    "DSA": [
        "data structures and algorithms",
        "data structures & algorithms",
        "dsa"
    ],
    "OOP": [
        "object oriented programming",
        "object-oriented programming",
        "oops",
        "oop"
    ],
    "DBMS": [
        "dbms",
        "database management systems"
    ],
    "Operating Systems": [
        "operating systems"
    ],
    "Computer Networks": [
        "computer networks",
        "computer networking"
    ],
}


# ---------------------------------------
# 2. Education keywords
# ---------------------------------------

EDUCATION_ALIASES = {
    "B.Tech": [
        "b.tech",
        "btech",
        "bachelor of technology"
    ],
    "B.E.": [
        "b.e.",
        "bachelor of engineering"
    ],
    "M.Tech": [
        "m.tech",
        "mtech",
        "master of technology"
    ],
    "M.E.": [
        "m.e.",
        "master of engineering"
    ],
    "B.Sc": [
        "b.sc",
        "bsc",
        "bachelor of science"
    ],
    "M.Sc": [
        "m.sc",
        "msc",
        "master of science"
    ],
    "BCA": [
        "bca",
        "bachelor of computer applications"
    ],
    "MCA": [
        "mca",
        "master of computer applications"
    ],
    "MBA": [
        "mba",
        "master of business administration"
    ],
    "Bachelor": ["bachelor", "bachelors"],
    "Master": ["master", "masters"],
    "PhD": ["phd", "ph.d", "doctor of philosophy"],
}


EXPERIENCE_KEYWORDS = [
    "experience",
    "intern",
    "internship",
    "engineer",
    "developer",
    "analyst",
    "employment",
    "work history",
]


# ---------------------------------------
# 3. Text matching helper
# ---------------------------------------

def contains_term(text, term):
    """
    Match a whole technical term, not a substring.

    Examples:
    - Java should not match JavaScript.
    - React should match ReactJS through its alias.
    - C++ should be matched literally.
    """

    pattern = (
        r"(?<![A-Za-z0-9_])"
        + re.escape(term)
        + r"(?![A-Za-z0-9_])"
    )

    return bool(
        re.search(pattern, text, re.IGNORECASE)
    )


def extract_alias_matches(text, alias_map):
    """
    Return standardized labels for detected terms.
    """

    found = []

    for standard_name, aliases in alias_map.items():
        for alias in aliases:
            if contains_term(text, alias):
                found.append(standard_name)
                break

    return found


# ---------------------------------------
# 4. Extract candidate name
# ---------------------------------------

def extract_name(text):
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    ignored_headings = {
        "resume",
        "curriculum vitae",
        "professional summary",
        "career objective",
        "personal details",
        "contact information",
        "technical skills",
        "work experience",
        "education",
        "projects",
    }

    for line in lines[:8]:

        if (
            "@" in line
            or "http" in line.lower()
            or any(char.isdigit() for char in line)
        ):
            continue

        if line.lower() in ignored_headings:
            continue

        words = line.split()

        if not 2 <= len(words) <= 4:
            continue

        if all(
            re.fullmatch(r"[A-Za-z]+(?:[-'][A-Za-z]+)*", word)
            for word in words
        ):
            return line

    return None


# ---------------------------------------
# 5. Extract email
# ---------------------------------------

def extract_email(text):
    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return match.group(0) if match else None


# ---------------------------------------
# 6. Extract phone
# ---------------------------------------

def extract_phone(text):
    """
    Detect common Indian mobile number formats.
    """

    match = re.search(
        r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)",
        text
    )

    return match.group(0) if match else None


# ---------------------------------------
# 7. Extract technical skills
# ---------------------------------------

def extract_skills(text):
    return extract_alias_matches(
        text,
        SKILL_ALIASES
    )


# ---------------------------------------
# 8. Extract education
# ---------------------------------------


def extract_education(text):
    education = extract_alias_matches(
        text,
        EDUCATION_ALIASES
    )

    bachelor_degrees = {
        "B.Tech", "B.E.", "B.Sc", "BCA"
    }

    master_degrees = {
        "M.Tech", "M.E.", "M.Sc", "MCA", "MBA"
    }

    if any(degree in education for degree in bachelor_degrees):
        if "Bachelor" in education:
            education.remove("Bachelor")

    if any(degree in education for degree in master_degrees):
        if "Master" in education:
            education.remove("Master")

    return education



# ---------------------------------------
# 9. Extract experience-related lines
# ---------------------------------------

def extract_experience(text):
    experience_lines = []

    for line in text.splitlines():
        cleaned_line = line.strip()

        if not cleaned_line:
            continue

        if any(
            contains_term(cleaned_line, keyword)
            for keyword in EXPERIENCE_KEYWORDS
        ):
            experience_lines.append(cleaned_line)

    return experience_lines[:10]


# ---------------------------------------
# 10. Main extraction function
# ---------------------------------------

def extract_candidate_details(text):
    """
    Extract structured candidate information
    from raw resume text.
    """

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text)
    }
