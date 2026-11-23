
import { useState } from "react";
import {
  Search,
  Users,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BriefcaseBusiness,
  Info,
} from "lucide-react";

// Reusable score bar
function ScoreBar({ label, value, color = "#69745E" }) {
  const hasScore = value !== null && value !== undefined;
  const safeScore = hasScore
    ? Math.max(0, Math.min(100, Number(value) || 0))
    : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-[#77746D]">{label}</span>
        <span className="text-xs font-semibold text-[#252520]">
          {hasScore ? `${safeScore.toFixed(2)}%` : "Not evaluated"}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#EEECE5]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${safeScore}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

// Reusable skill tag list
function SkillList({ skills = [], type = "matched" }) {
  if (!skills.length) {
    return (
      <p className="text-xs text-[#8B877F]">
        {type === "matched"
          ? "No matching skills detected."
          : "No undetected skills in this category."}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-md px-3 py-1.5 text-xs ${
            type === "matched"
              ? "bg-[#EEF2EA] text-[#52634B]"
              : "bg-[#F5EFE5] text-[#8B7355]"
          }`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// Reusable skills section
function SkillsSection({
  title,
  score,
  matched = [],
  missing = [],
  accent = "#69745E",
}) {
  return (
    <div className="rounded-xl border border-[#E8E5DD] bg-white p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#252520]">
          {title}
        </h4>

        <span className="rounded-full bg-[#F3F1EB] px-3 py-1 text-xs font-medium text-[#69665F]">
          {score == null ? "Not evaluated" : `${score.toFixed(2)}% match`}
        </span>
      </div>

      <ScoreBar
        label="Detected skill coverage"
        value={score}
        color={accent}
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#69745E]" />
            <p className="text-xs font-semibold text-[#252520]">
              Matched ({matched.length})
            </p>
          </div>

          <SkillList skills={matched} type="matched" />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#A58C64]" />
            <p className="text-xs font-semibold text-[#252520]">
              Not detected ({missing.length})
            </p>
          </div>

          <SkillList skills={missing} type="missing" />
        </div>
      </div>
    </div>
  );
}

export default function Candidates({ results }) {
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const candidates = results?.ranked_candidates || [];

  // Filter by candidate name, filename, or detected skills
  const filteredCandidates = candidates.filter((item) => {
    const query = search.trim().toLowerCase();

    const searchableText = [
      item.candidate?.name || "",
      item.filename || "",
      ...(item.candidate?.skills || []),
      ...(item.matched_skills || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  if (candidates.length === 0) {
    return (
      <div className="rounded-xl border border-[#ECE9E2] bg-white p-12 text-center">
        <Users
          size={30}
          className="mx-auto mb-4 text-[#8B877F]"
        />

        <h2 className="font-semibold text-[#252520]">
          No candidates yet
        </h2>

        <p className="mt-2 text-sm text-[#8B877F]">
          Run an analysis to view your ranked candidates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="rounded-xl border border-[#ECE9E2] bg-white p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-[#8B877F]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates or skills..."
            className="w-full rounded-lg border border-[#E5E1D9] bg-[#FCFBF8] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#99958A]"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[#8B877F]">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>

          <span className="rounded-full bg-[#EEF2EA] px-3 py-1 text-xs text-[#52634B]">
            AI-assisted matching
          </span>
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-3">
        {filteredCandidates.map((item, index) => {
          const candidateKey = `${item.filename}-${item.rank ?? index}`;
          const isOpen = selectedCandidate === candidateKey;

          // New backend fields
          const hasDetailedSkills =
            Array.isArray(item.matched_required_skills) ||
            Array.isArray(item.missing_required_skills) ||
            Array.isArray(item.matched_preferred_skills) ||
            Array.isArray(item.missing_preferred_skills);

          const matchedRequired = hasDetailedSkills
            ? item.matched_required_skills || []
            : item.matched_skills || [];

          const missingRequired = hasDetailedSkills
            ? item.missing_required_skills || []
            : item.missing_skills || [];

          const matchedPreferred =
            item.matched_preferred_skills || [];

          const missingPreferred =
            item.missing_preferred_skills || [];

          const requiredScore = hasDetailedSkills
            ? item.required_skills_score
            : item.skills_score;

          const preferredScore = hasDetailedSkills
            ? item.preferred_skills_score
            : null;

          const breakdown = item.score_breakdown || {};

          const scoreItems = [
            {
              key: "semantic",
              label: "Semantic Similarity",
              value: item.semantic_score,
            },
            {
              key: "skills",
              label: "Combined Skills Match",
              value: item.skills_score,
            },
            {
              key: "education",
              label: "Education Match",
              value: item.education_score,
            },
            {
              key: "experience",
              label: "Experience Match",
              value: item.experience_score,
            },
          ];

          return (
            <div
              key={candidateKey}
              className="overflow-hidden rounded-xl border border-[#ECE9E2] bg-white"
            >
              {/* Candidate Summary */}
              <button
                type="button"
                onClick={() =>
                  setSelectedCandidate(
                    isOpen ? null : candidateKey
                  )
                }
                aria-expanded={isOpen}
                className="w-full p-5 text-left transition hover:bg-[#FCFBF8]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F1EFE8] text-sm font-semibold text-[#252520]">
                      #{item.rank}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-[#252520]">
                        {item.candidate?.name || item.filename}
                      </h3>

                      <p className="mt-1 truncate text-xs text-[#8B877F]">
                        {item.filename}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-semibold text-[#252520]">
                        {item.final_score ?? "—"}
                        <span className="text-xs font-normal text-[#8B877F]">
                          /100
                        </span>
                      </p>

                      <p className="text-xs text-[#8B877F]">
                        Alignment score
                      </p>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-[#8B877F] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F1EFE8]">
                  <div
                    className="h-full rounded-full bg-[#69745E] transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(item.final_score) || 0)
                      )}%`,
                    }}
                  />
                </div>
              </button>

              {/* Expanded Candidate Details */}
              {isOpen && (
                <div className="space-y-6 border-t border-[#ECE9E2] bg-[#FCFBF8] p-5">
                  {/* Skills Overview */}
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness
                      size={18}
                      className="text-[#69745E]"
                    />

                    <h4 className="text-sm font-semibold text-[#252520]">
                      Job Requirements Match
                    </h4>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <SkillsSection
                      title="Required Skills"
                      score={requiredScore}
                      matched={matchedRequired}
                      missing={missingRequired}
                      accent="#69745E"
                    />

                    <SkillsSection
                      title="Preferred Skills"
                      score={preferredScore}
                      matched={matchedPreferred}
                      missing={missingPreferred}
                      accent="#B7A68B"
                    />
                  </div>

                  {/* AI Score Breakdown */}
                  <div className="border-t border-[#E5E1D9] pt-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles
                        size={17}
                        className="text-[#69745E]"
                      />

                      <h4 className="text-sm font-semibold text-[#252520]">
                        AI Score Breakdown
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {scoreItems.map((score) => {
                        const details = breakdown[score.key];

                        return (
                          <div
                            key={score.key}
                            className="rounded-lg border border-[#E5E1D9] bg-white p-4"
                          >
                            <p className="text-xs text-[#8B877F]">
                              {score.label}
                            </p>

                            <p className="mt-2 text-xl font-semibold text-[#252520]">
                              {score.value == null
                                ? "Not evaluated"
                                : `${Number(score.value).toFixed(2)}/100`}
                            </p>

                            {details?.status === "evaluated" && (
                              <p className="mt-2 text-xs text-[#8B877F]">
                                Effective weight:{" "}
                                {details.effective_weight}%
                                <span className="block">
                                  Score contribution:{" "}
                                  {details.contribution} points
                                </span>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scoring Explanation */}
                  <div className="rounded-lg border border-[#E8E5DD] bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Info
                        size={17}
                        className="mt-0.5 shrink-0 text-[#8B877F]"
                      />

                      <div>
                        <p className="text-sm font-medium text-[#252520]">
                          How this score works
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#77746D]">
                          HireLens AI' estimates alignment between the
                          resume and job description using semantic
                          similarity, detected technical skills,
                          and education keywords.
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#77746D]">
                          When both skill categories are available,
                          required skills contribute 80% and
                          preferred skills contribute 20% of
                          the skills score.
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#77746D]">
                          Professional experience is not currently
                          evaluated. Skills not detected in a
                          resume are not necessarily absent.
                          These estimates should support human
                          review, not automatic hiring decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Search Results */}
      {filteredCandidates.length === 0 && (
        <p className="py-8 text-center text-sm text-[#8B877F]">
          No candidates match your search.
        </p>
      )}
    </div>
  );
}
