
import {
  Users,
  FileText,
  Target,
  ArrowUpRight,
  Trophy,
  BarChart3,
  Upload,
  Plus,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function Overview({
  results,
  onNewAnalysis,
  onViewCandidates,
}) {
  const candidates = results?.ranked_candidates || [];
  const totalCandidates = candidates.length;

  const averageScore =
    totalCandidates > 0
      ? (
          candidates.reduce(
            (sum, item) =>
              sum + (Number(item.final_score) || 0),
            0
          ) / totalCandidates
        ).toFixed(2)
      : null;

  const sortedCandidates = [...candidates].sort(
    (a, b) =>
      (Number(b.final_score) || 0) -
      (Number(a.final_score) || 0)
  );

  const topCandidate = sortedCandidates[0];

  const chartData = sortedCandidates.map((item, index) => ({
    name:
      item.candidate?.name ||
      item.filename ||
      `Candidate ${index + 1}`,
    score: Number(item.final_score) || 0,
  }));

  const stats = [
    {
      label: "Total Resumes",
      value: results?.total_candidates ?? totalCandidates,
      icon: FileText,
    },
    {
      label: "Candidates Ranked",
      value: totalCandidates,
      icon: Users,
    },
    {
      label: "Average Match",
      value: averageScore === null ? "—" : `${averageScore}%`,
      icon: Target,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#ECE9E2] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#8B877F]">
                  {stat.label}
                </p>

                <Icon
                  size={19}
                  className="text-[#A19C93]"
                />
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#252520]">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-[#A19C93]">
                {totalCandidates > 0
                  ? "Latest analysis"
                  : "No analysis available"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalCandidates === 0 ? (
        <div className="rounded-xl border border-[#ECE9E2] bg-white p-8">
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-[#E5E1D9] bg-[#FCFBF8] text-center">

            <div className="mb-4 rounded-xl bg-[#F1EFE8] p-4">
              <Upload
                size={24}
                className="text-[#77746D]"
              />
            </div>

            <h3 className="font-medium text-[#252520]">
              No analyses yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#8B877F]">
              Upload candidate resumes and enter a job description
              to see your AI matching insights here.
            </p>

            <button
              type="button"
              onClick={onNewAnalysis}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[#252520] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#44443D]"
            >
              <Plus size={17} />
              Start an Analysis
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Candidate Ranking Chart */}
          <section className="rounded-xl border border-[#ECE9E2] bg-white p-6 md:p-8">

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <BarChart3
                    size={19}
                    className="text-[#69745E]"
                  />

                  <h2 className="text-lg font-semibold">
                    Candidate Match Comparison
                  </h2>
                </div>

                <p className="text-sm text-[#8B877F]">
                  Resume-to-job matching scores from your latest analysis.
                </p>
              </div>

              <button
                type="button"
                onClick={onViewCandidates}
                className="flex items-center gap-2 text-sm font-medium text-[#69745E] transition hover:text-[#252520]"
              >
                View Candidates
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#ECE9E2"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: "#8B877F",
                    }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                    height={75}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fontSize: 12,
                      fill: "#8B877F",
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}/100`,
                      "Match Score",
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #ECE9E2",
                      backgroundColor: "#FFFEFB",
                      fontSize: "12px",
                    }}
                  />

                  <Bar
                    dataKey="score"
                    fill="#69745E"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={65}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Top Candidate */}
          {topCandidate && (
            <section className="rounded-xl border border-[#ECE9E2] bg-white p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Trophy
                  size={20}
                  className="text-[#69745E]"
                />

                <h2 className="text-lg font-semibold">
                  Highest Match
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#ECE9E2] bg-[#FCFBF8] p-5">
                <div>
                  <p className="text-lg font-semibold">
                    {topCandidate.candidate?.name ||
                      topCandidate.filename}
                  </p>

                  <p className="mt-1 text-xs text-[#8B877F]">
                    {topCandidate.filename}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-[#69745E]">
                    {topCandidate.final_score}/100
                  </p>

                  <p className="text-xs text-[#8B877F]">
                    Estimated match
                  </p>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium">
                  Matched Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {topCandidate.matched_skills?.length ? (
                    topCandidate.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#EEF2EA] px-3 py-1.5 text-xs text-[#52634B]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#8B877F]">
                      No matched skills detected.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onViewCandidates}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-[#69745E] hover:text-[#252520]"
              >
                Explore candidate details
                <ArrowUpRight size={16} />
              </button>
            </section>
          )}
        </>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-[#A19C93]">
        Scores estimate job-description alignment and should be
        reviewed alongside original resumes.
      </p>
    </div>
  );
}
