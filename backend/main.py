from routers.jobs import router as jobs_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.resumes import router as resume_router 
from routers.ranking import router as ranking_router

# Step 1: Create FastAPI application
app = FastAPI()

# Step 2: Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Step 3: Register resume upload router
app.include_router(resume_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(ranking_router, prefix="/api")

# Step 4: Home endpoint
@app.get("/")
def home():
    return {"message": "Backend is running successfully"}

# Step 5: Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "message": "React connected to FastAPI successfully!"
    }
