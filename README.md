# HireLens AI

### Intelligent Resume Screening & Candidate Ranking System

HireLens AI is an AI-powered web application designed to simplify the initial resume screening process. It analyzes resumes against job descriptions, identifies relevant skills, calculates semantic similarity, and ranks candidates based on their alignment with job requirements.

The application combines Natural Language Processing (NLP), Sentence Transformers, and a modern React dashboard to provide an intuitive recruitment analysis experience.

## Features

- **Multiple Resume Uploads:** Upload and process multiple PDF and DOCX resumes.
- **Resume Information Extraction:** Extract candidate names, contact details, skills, and education.
- **Job Description Analysis:** Identify required skills, preferred skills, educational qualifications, and experience requirements.
- **Semantic Matching:** Compare resumes with job descriptions using Sentence Transformers.
- **Candidate Ranking:** Rank candidates according to calculated resume-to-job alignment scores.
- **Skill Gap Analysis:** Display matched and undetected skills for each candidate.
- **Analytics Dashboard:** Visualize candidate scores and matching insights.
- **Detailed Score Breakdown:** View semantic similarity, skills matching, and education matching scores.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| AI / NLP | Sentence Transformers, all-MiniLM-L6-v2 |
| Similarity Measurement | Cosine Similarity |
| Document Processing | PyPDF, python-docx |
| API Communication | Axios |
| UI Icons | Lucide React |

## How It Works

1. The user enters a job description.
2. Multiple candidate resumes are uploaded.
3. The backend extracts text and relevant candidate information.
4. The system identifies required and preferred job skills.
5. Sentence Transformers generate semantic representations for matching.
6. Candidate alignment scores are calculated using semantic similarity, skill matching, and education matching.
7. Candidates are ranked and displayed in the dashboard.

When both required and preferred skills are present, the skills component gives 80% weight to required skills and 20% to preferred skills. The overall ranking combines available scoring components. Experience scoring is not yet implemented.

## Project Structure

```text
resume-ai-matcher/
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── services/
│   └── test_skill_ranking.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10 or compatible version
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sourav2212/HireLens-AI.git
cd HireLens-AI
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment on Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies used by the project:

```bash
python -m pip install fastapi uvicorn python-multipart pypdf python-docx sentence-transformers scikit-learn
```

Start the FastAPI backend:

```powershell
$env:USE_TF="0"
python -m uvicorn main:app --reload
```

The backend will run at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

## AI Matching Methodology

HireLens AI combines multiple signals to estimate how closely a candidate's resume aligns with a job description.

| Component | Base Weight |
|---|---:|
| Semantic Similarity | 35% |
| Skills Matching | 35% |
| Education Matching | 10% |
| Experience Matching | 20% |

**Note:** Experience matching is not currently evaluated. The system redistributes the weights among available scoring components.

For skills matching, required skills receive greater importance than preferred skills.

The final score is a heuristic alignment estimate rather than a validated prediction of job performance or hiring suitability.

## Current Limitations

- Candidate information extraction relies partly on text and keyword patterns.
- Scanned or image-only resumes may require OCR support.
- Experience scoring is not yet implemented.
- Results are stored in frontend session state rather than a persistent database.
- Human review is necessary because automated screening can miss relevant qualifications or produce inaccurate matches.

## Future Enhancements

- Advanced resume parsing and OCR
- Experience-based scoring
- Persistent candidate database
- Candidate report export
- User authentication
- Improved skill synonym recognition
- Cloud deployment

## Testing

The project includes a skill-ranking test covering required and preferred skills.

Run:

```powershell
cd backend
$env:USE_TF="0"
python test_skill_ranking.py
```

The test checks the expected skill matching percentages and combined weighted score.

## Repository

[HireLens AI — GitHub](https://github.com/sourav2212/HireLens-AI)

## Disclaimer

HireLens AI is an educational project intended to demonstrate NLP-based resume analysis and candidate-job matching. It should be used as a decision-support tool, not as the sole basis for employment decisions.
