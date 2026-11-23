
import { useState } from "react";

import NewAnalysis from "./components/NewAnalysis";
import Candidates from "./components/Candidates";
import Overview from "./components/Overview";
import Analytics from "./components/Analytics";
import HeaderActions from "./components/HeaderActions";

import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
} from "lucide-react";

// Sidebar navigation items
const menuItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "New Analysis", icon: FileText },
  { name: "Candidates", icon: Users },
  { name: "Analytics", icon: BarChart3 },
];

function App() {
  // Currently selected page
  const [activePage, setActivePage] = useState("Overview");

  // Store AI analysis results across pages
  const [analysisResults, setAnalysisResults] = useState(null);

  // Called when FastAPI successfully analyzes resumes
  const handleAnalysisComplete = (data) => {
    setAnalysisResults(data);

    // Automatically navigate to Candidates page
    setActivePage("Candidates");
  };

  // Open New Analysis page
  const handleNewAnalysis = () => {
    setActivePage("New Analysis");
  };

  // Open Candidates page
  const handleViewCandidates = () => {
    setActivePage("Candidates");
  };

  // Clear current analysis
  const handleClearResults = () => {
    setAnalysisResults(null);
    setActivePage("Overview");
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] p-4 md:p-8">
      <div className="mx-auto flex min-h-[90vh] max-w-[1500px] overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#FFFEFB] shadow-sm">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-[#ECE9E2] p-6 md:flex">

          {/* Logo */}
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-lg bg-[#252520] p-2 text-white">
              <Sparkles size={19} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              HireLens AI
            </span>
          </div>

          {/* Workspace Label */}
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#A19C93]">
            Workspace
          </p>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActivePage(item.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                    activePage === item.name
                      ? "bg-[#F1EFE8] font-medium text-[#252520]"
                      : "text-[#77746D] hover:bg-[#F7F5F0]"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto border-t border-[#ECE9E2] pt-6">
            <div className="flex items-center gap-3 text-sm text-[#77746D]">
              <Settings size={18} />
              Settings
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="min-w-0 flex-1">

          {/* Top Header */}
          <header className="flex items-center justify-between border-b border-[#ECE9E2] px-5 py-5 md:px-10">

            {/* Breadcrumb */}
            <span className="text-sm text-[#8B877F]">
              Workspace / {activePage}
            </span>

            {/* Functional Header Actions */}
            <HeaderActions
              results={analysisResults}
              onViewCandidates={handleViewCandidates}
              onClearResults={handleClearResults}
            />

          </header>

          {/* ================= PAGE CONTENT ================= */}
          <div className="p-5 md:p-10">

            {/* Page Heading */}
            <div className="mb-9 flex flex-wrap items-center justify-between gap-4">

              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-[#A19C93]">
                  Recruitment intelligence
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-[#252520]">
                  {activePage}
                </h1>

                {/* Dynamic Page Description */}
                <p className="mt-2 text-sm text-[#8B877F]">
                  {activePage === "New Analysis"
                    ? "Analyze resumes against your job requirements."
                    : activePage === "Candidates"
                    ? "Explore ranked candidates and their AI matching scores."
                    : activePage === "Analytics"
                    ? "Explore insights from your resume analysis."
                    : "Your AI-powered recruitment workspace."}
                </p>
              </div>

              {/* New Analysis Button */}
              {activePage !== "New Analysis" && (
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="flex items-center gap-2 rounded-lg bg-[#252520] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#44443D]"
                >
                  <Plus size={17} />
                  New Analysis
                </button>
              )}
            </div>

            {/* ================= PAGE NAVIGATION ================= */}

            {activePage === "New Analysis" ? (

              // New Analysis Page
              <NewAnalysis
                onAnalysisComplete={handleAnalysisComplete}
              />

            ) : activePage === "Candidates" ? (

              // Candidate Explorer Page
              <Candidates
                results={analysisResults}
              />

            ) : activePage === "Overview" ? (

              // Overview Dashboard with real AI data
              <Overview
                results={analysisResults}
                onNewAnalysis={handleNewAnalysis}
                onViewCandidates={handleViewCandidates}
              />

            ) : activePage === "Analytics" ? (

              // Analytics Dashboard with real AI data
              <Analytics
                results={analysisResults}
              />

            ) : null}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
