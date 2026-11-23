
import { useRef, useState } from "react";

import {
  UploadCloud,
  FileText,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from "lucide-react";

import { rankCandidates } from "../services/api";

export default function NewAnalysis({ onAnalysisComplete }) {
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const fileInputRef = useRef(null);

  // Add PDF and DOCX files
  const addFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) =>
      /\.(pdf|docx)$/i.test(file.name)
    );

    if (validFiles.length === 0) {
      setError("Please select PDF or DOCX resume files.");
      return;
    }

    setFiles((previous) => [...previous, ...validFiles]);
    setResults(null);
    setError("");
  };

  // Remove a selected resume
  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setResults(null);
  };

  // Send resumes and job description to FastAPI
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || files.length === 0) {
      setError(
        "Please enter a job description and upload at least one resume."
      );
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResults(null);

    try {
      const data = await rankCandidates(
        jobDescription,
        files
      );

      // Store results locally
      setResults(data);

      // Send results to App.jsx and navigate to Candidates
      onAnalysisComplete?.(data);

    } catch (err) {
      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Analysis failed. Please check that your FastAPI backend is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Input Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Job Description */}
        <section className="rounded-xl border border-[#ECE9E2] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <FileText
              size={20}
              className="text-[#77746D]"
            />

            <div>
              <h2 className="font-semibold">
                Job Description
              </h2>

              <p className="text-sm text-[#8B877F]">
                Define the role you're hiring for.
              </p>
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setResults(null);
            }}
            placeholder="Paste the job description here..."
            className="min-h-[300px] w-full resize-y rounded-lg border border-[#E5E1D9] bg-[#FCFBF8] p-4 text-sm leading-7 outline-none transition focus:border-[#99958A]"
          />

          <p className="mt-3 text-right text-xs text-[#A19C93]">
            {jobDescription.length} characters
          </p>
        </section>

        {/* Resume Upload */}
        <section className="rounded-xl border border-[#ECE9E2] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <UploadCloud
              size={20}
              className="text-[#77746D]"
            />

            <div>
              <h2 className="font-semibold">
                Candidate Resumes
              </h2>

              <p className="text-sm text-[#8B877F]">
                Upload multiple PDF or DOCX files.
              </p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {/* Drag and Drop Area */}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => {
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${
              isDragging
                ? "border-[#77746D] bg-[#F1EFE8]"
                : "border-[#E5E1D9] bg-[#FCFBF8] hover:bg-[#F7F5F0]"
            }`}
          >
            <UploadCloud
              size={28}
              className="mb-4 text-[#8B877F]"
            />

            <p className="text-sm font-medium">
              Drag & drop your resumes here
            </p>

            <p className="mt-2 text-xs text-[#8B877F]">
              or click to browse files
            </p>

            <p className="mt-4 text-xs text-[#A19C93]">
              PDF, DOCX supported
            </p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="mb-3 text-sm font-medium">
                Selected files ({files.length})
              </p>

              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-[#ECE9E2] px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText
                      size={16}
                      className="shrink-0 text-[#8B877F]"
                    />

                    <span className="truncate text-sm">
                      {file.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    disabled={isAnalyzing}
                    onClick={() => removeFile(index)}
                    className="ml-3 shrink-0 text-[#8B877F] hover:text-red-500 disabled:opacity-40"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={
            !jobDescription.trim() ||
            files.length === 0 ||
            isAnalyzing
          }
          className="flex items-center gap-3 rounded-lg bg-[#252520] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#44443D] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isAnalyzing ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Analyzing resumes...
            </>
          ) : (
            <>
              Analyze & Rank Candidates
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>

      {/* Loading Message */}
      {isAnalyzing && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-[#ECE9E2] bg-white p-5"
        >
          <Loader2
            size={20}
            className="animate-spin text-[#77746D]"
          />

          <div>
            <p className="text-sm font-medium">
              AI analysis in progress
            </p>

            <p className="mt-1 text-xs text-[#8B877F]">
              Processing resumes and calculating matching scores.
              This may take a little time.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <AlertCircle
            size={20}
            className="shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* AI Ranking Results */}
      {results && (
        <section className="rounded-xl border border-[#ECE9E2] bg-white p-6">

          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2
                  size={20}
                  className="text-[#69745E]"
                />

                <h2 className="text-xl font-semibold">
                  Analysis Complete
                </h2>
              </div>

              <p className="text-sm text-[#8B877F]">
                {results.total_candidates} candidates analyzed
              </p>
            </div>

            <Trophy
              size={22}
              className="text-[#8B877F]"
            />
          </div>

          {/* Ranked Candidate List */}
          <div className="space-y-3">
            {results.ranked_candidates?.map((item) => (
              <div
                key={`${item.rank}-${item.filename}`}
                className="rounded-lg border border-[#ECE9E2] p-4 transition hover:bg-[#FCFBF8]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">

                    {/* Rank */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EFE8] text-sm font-semibold">
                      #{item.rank}
                    </div>

                    {/* Candidate Information */}
                    <div>
                      <p className="font-medium">
                        {item.candidate?.name ||
                          item.filename}
                      </p>

                      <p className="mt-1 text-xs text-[#8B877F]">
                        {item.filename}
                      </p>
                    </div>
                  </div>

                  {/* Matching Score */}
                  <div className="text-right">
                    <p className="text-2xl font-semibold">
                      {item.final_score ?? "—"}
                      <span className="text-sm font-normal text-[#8B877F]">
                        /100
                      </span>
                    </p>

                    <p className="text-xs text-[#8B877F]">
                      Match score
                    </p>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
                  <div
                    className="h-full rounded-full bg-[#69745E] transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(item.final_score) || 0
                        )
                      )}%`,
                    }}
                  />
                </div>

                {/* Matched Skills */}
                {item.matched_skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#EEF2EA] px-2.5 py-1 text-xs text-[#52634B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Missing Skills */}
                {item.missing_skills?.length > 0 && (
                  <p className="mt-3 text-xs text-[#8B877F]">
                    <span className="font-medium">
                      Skills not detected:
                    </span>{" "}
                    {item.missing_skills.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-[#8B877F]">
            Scores indicate estimated job-description alignment,
            not a hiring recommendation. Review original resumes
            before making decisions.
          </p>
        </section>
      )}
    </div>
  );
}
