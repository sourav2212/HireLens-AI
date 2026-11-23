
import { useMemo } from "react";

import {
  BarChart3,
  Users,
  Target,
  Trophy,
  CheckCircle2,
  AlertCircle,
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

export default function Analytics({ results }) {
  const candidates = results?.ranked_candidates || [];

  const analytics = useMemo(() => {
    const scores = candidates
      .map((candidate) => Number(candidate.final_score))
      .filter(Number.isFinite);

    const average = scores.length
      ? scores.reduce((sum, score) => sum + score, 0) /
        scores.length
      : 0;

    const highest = scores.length
      ? Math.max(...scores)
      : 0;

    const ranges = [
      { range: "0–20", min: 0, max: 20 },
      { range: "20–40", min: 20, max: 40 },
      { range: "40–60", min: 40, max: 60 },
      { range: "60–80", min: 60, max: 80 },
      { range: "80–100", min: 80, max: 101 },
    ];

    const distribution = ranges.map((range) => ({
      range: range.range,
      count: scores.filter(
        (score) =>
          score >= range.min && score < range.max
      ).length,
    }));

    const matchedSkills = {};
    const missingSkills = {};

    candidates.forEach((candidate) => {
      // Count each skill once per candidate
      new Set(candidate.matched_skills || []).forEach(
        (skill) => {
          matchedSkills[skill] =
            (matchedSkills[skill] || 0) + 1;
        }
      );

      new Set(candidate.missing_skills || []).forEach(
        (skill) => {
          missingSkills[skill] =
            (missingSkills[skill] || 0) + 1;
        }
      );
    });

    const toSortedArray = (skills) =>
      Object.entries(skills)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    return {
      average,
      highest,
      distribution,
      matched: toSortedArray(matchedSkills),
      missing: toSortedArray(missingSkills),
    };
  }, [candidates]);

  if (candidates.length === 0) {
    return (
      <div className="rounded-xl border border-[#ECE9E2] bg-white p-12 text-center">
        <BarChart3
          size={30}
          className="mx-auto mb-4 text-[#8B877F]"
        />

        <h2 className="font-semibold">
          No analytics available
        </h2>

        <p className="mt-2 text-sm text-[#8B877F]">
          Complete a resume analysis to see matching insights.
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Candidates Analyzed",
      value: candidates.length,
      icon: Users,
    },
    {
      label: "Highest Match",
      value: `${analytics.highest.toFixed(2)}/100`,
      icon: Trophy,
    },
    {
      label: "Average Match",
      value: `${analytics.average.toFixed(2)}/100`,
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

              <h2 className="mt-5 text-2xl font-semibold text-[#252520]">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-[#A19C93]">
                Latest analysis
              </p>
            </div>
          );
        })}
      </div>

      {/* Score Distribution */}
      <section className="rounded-xl border border-[#ECE9E2] bg-white p-6 md:p-8">
        <h2 className="text-lg font-semibold">
          Score Distribution
        </h2>

        <p className="mt-2 text-sm text-[#8B877F]">
          Number of candidates in each matching-score range.
        </p>

        <div className="mt-8 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.distribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ECE9E2"
              />

              <XAxis
                dataKey="range"
                tick={{ fontSize: 12, fill: "#8B877F" }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#8B877F" }}
              />

              <Tooltip
                formatter={(value) => [
                  value,
                  "Candidates",
                ]}
              />

              <Bar
                dataKey="count"
                fill="#69745E"
                radius={[6, 6, 0, 0]}
                maxBarSize={70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Skill Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Matched Skills */}
        <section className="rounded-xl border border-[#ECE9E2] bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2
              size={19}
              className="text-[#69745E]"
            />

            <h2 className="text-lg font-semibold">
              Most Matched Skills
            </h2>
          </div>

          <p className="mb-6 text-sm text-[#8B877F]">
            Skills detected across candidate resumes.
          </p>

          {analytics.matched.length ? (
            <div className="space-y-4">
              {analytics.matched.map((item) => (
                <div key={item.skill}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.skill}</span>
                    <span className="text-[#8B877F]">
                      {item.count}/{candidates.length}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
                    <div
                      className="h-full rounded-full bg-[#69745E]"
                      style={{
                        width: `${
                          (item.count / candidates.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8B877F]">
              No matched skills detected.
            </p>
          )}
        </section>

        {/* Missing Skills */}
        <section className="rounded-xl border border-[#ECE9E2] bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <AlertCircle
              size={19}
              className="text-[#A58C64]"
            />

            <h2 className="text-lg font-semibold">
              Skills Not Detected
            </h2>
          </div>

          <p className="mb-6 text-sm text-[#8B877F]">
            Job-description skills not detected in resumes.
          </p>

          {analytics.missing.length ? (
            <div className="space-y-4">
              {analytics.missing.map((item) => (
                <div key={item.skill}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.skill}</span>
                    <span className="text-[#8B877F]">
                      {item.count}/{candidates.length}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#F1EFE8]">
                    <div
                      className="h-full rounded-full bg-[#A58C64]"
                      style={{
                        width: `${
                          (item.count / candidates.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8B877F]">
              No missing skill keywords detected.
            </p>
          )}
        </section>
      </div>

      <p className="text-center text-xs text-[#A19C93]">
        Analytics are based on estimated resume-to-job matching
        scores. They should not be used as automatic hiring decisions.
      </p>
    </div>
  );
}
