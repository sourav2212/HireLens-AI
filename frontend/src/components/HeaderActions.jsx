
import { useState } from "react";
import {
  Search,
  Bell,
  X,
  CheckCircle2,
  Users,
  Trash2,
} from "lucide-react";

export default function HeaderActions({
  results,
  onViewCandidates,
  onClearResults,
}) {
  const [openPanel, setOpenPanel] = useState(null);
  const [query, setQuery] = useState("");
  const [notificationRead, setNotificationRead] = useState(false);

  const candidates = results?.ranked_candidates || [];

  const matches = query.trim()
    ? candidates.filter((item) => {
        const search = query.toLowerCase();

        return (
          (item.candidate?.name || "")
            .toLowerCase()
            .includes(search) ||
          (item.filename || "")
            .toLowerCase()
            .includes(search) ||
          (item.matched_skills || []).some((skill) =>
            skill.toLowerCase().includes(search)
          )
        );
      })
    : [];

  const togglePanel = (panel) => {
    setOpenPanel((current) =>
      current === panel ? null : panel
    );
  };

  const openCandidates = () => {
    setOpenPanel(null);
    onViewCandidates();
  };

  const clearAnalysis = () => {
    const confirmed = window.confirm(
      "Clear the current analysis results?"
    );

    if (!confirmed) return;

    onClearResults();
    setOpenPanel(null);
    setQuery("");
    setNotificationRead(false);
  };

  return (
    <div className="relative flex items-center gap-5 text-[#77746D]">

      {/* Search */}
      <button
        type="button"
        aria-label="Search candidates"
        onClick={() => togglePanel("search")}
        className="transition hover:text-[#252520]"
      >
        <Search size={18} />
      </button>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          togglePanel("notifications");
          setNotificationRead(true);
        }}
        className="relative transition hover:text-[#252520]"
      >
        <Bell size={18} />

        {results && !notificationRead && (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#69745E]" />
        )}
      </button>

      {/* Profile */}
      <button
        type="button"
        aria-label="Workspace profile"
        onClick={() => togglePanel("profile")}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9E5DB] text-sm font-medium text-[#252520] transition hover:bg-[#DCD7CB]"
      >
        R
      </button>

      {/* Dropdown Panel */}
      {openPanel && (
        <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-48px))] rounded-xl border border-[#ECE9E2] bg-white p-5 text-[#252520] shadow-xl">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {openPanel === "search"
                ? "Search Candidates"
                : openPanel === "notifications"
                ? "Notifications"
                : "Workspace"}
            </h3>

            <button
              type="button"
              aria-label="Close panel"
              onClick={() => setOpenPanel(null)}
              className="text-[#8B877F] hover:text-[#252520]"
            >
              <X size={17} />
            </button>
          </div>

          {/* Search Panel */}
          {openPanel === "search" && (
            <div>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, filename, or skill..."
                className="w-full rounded-lg border border-[#E5E1D9] bg-[#FCFBF8] px-3 py-2.5 text-sm outline-none focus:border-[#69745E]"
              />

              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {!query.trim() ? (
                  <p className="text-sm text-[#8B877F]">
                    Start typing to search your latest analysis.
                  </p>
                ) : matches.length === 0 ? (
                  <p className="text-sm text-[#8B877F]">
                    No matching candidates found.
                  </p>
                ) : (
                  matches.map((item, index) => (
                    <button
                      key={`${item.filename}-${index}`}
                      type="button"
                      onClick={openCandidates}
                      className="flex w-full items-center justify-between rounded-lg border border-[#ECE9E2] p-3 text-left transition hover:bg-[#F7F5F0]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.candidate?.name ||
                            item.filename}
                        </p>

                        <p className="mt-1 text-xs text-[#8B877F]">
                          Rank #{item.rank}
                        </p>
                      </div>

                      <span className="ml-2 text-sm font-semibold text-[#69745E]">
                        {item.final_score}/100
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notifications Panel */}
          {openPanel === "notifications" && (
            <div>
              {results ? (
                <div className="flex gap-3 rounded-lg bg-[#F7F8F5] p-3">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-[#69745E]"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Analysis completed
                    </p>

                    <p className="mt-1 text-xs text-[#8B877F]">
                      {candidates.length} candidates ranked
                      successfully.
                    </p>

                    <button
                      type="button"
                      onClick={openCandidates}
                      className="mt-3 text-xs font-medium text-[#69745E]"
                    >
                      View results
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#8B877F]">
                  No notifications yet.
                </p>
              )}
            </div>
          )}

          {/* Profile Panel */}
          {openPanel === "profile" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9E5DB] font-semibold">
                  R
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    HireLens AI' Workspace
                  </p>

                  <p className="text-xs text-[#8B877F]">
                    Local development session
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openCandidates}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F7F5F0]"
              >
                <Users size={16} />
                View Candidates
              </button>

              <button
                type="button"
                onClick={clearAnalysis}
                disabled={!results}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
                Clear Current Analysis
              </button>

              <p className="text-xs text-[#8B877F]">
                This is a local workspace menu, not an
                authenticated user account.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
