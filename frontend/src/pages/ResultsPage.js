// 📂 frontend/src/pages/ResultsPage.js
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import MatchScoreCard from "../components/MatchScoreCard";
import ResumeSummary from "../components/ResumeSummary";
import SkillsList from "../components/SkillsList";
import SuggestionsCard from "../components/SuggestionsCard";
import ErrorAlert from "../components/ErrorAlert";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [result, setResult] = useState(null);
  const [jobTitle, setJobTitle] = useState("Frontend Developer");

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
      localStorage.setItem("saved_result", JSON.stringify(location.state.result));
      if (location.state?.jobTitle) {
        setJobTitle(location.state.jobTitle);
        localStorage.setItem("saved_jobTitle", location.state.jobTitle);
      }
    } else {
      const savedResult = localStorage.getItem("saved_result");
      const savedTitle = localStorage.getItem("saved_jobTitle");
      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedTitle) setJobTitle(savedTitle);
    }
  }, [location.state]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] p-6 text-slate-800 dark:text-white">
        <ErrorAlert message="No analysis found. Please run evaluation first." />
        <button className="mt-6 font-semibold bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 text-white transition-colors" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  const { match_score = 0, match_feedback = "", resume_summary = "", resume_skills = {}, match_breakdown = {}, missing_skills = [], suggestions = [] } = result;

  const matchedCount = match_breakdown?.matched_count || 0;
  const totalJobSkills = match_breakdown?.total_job_skills || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans tracking-tight pt-10 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] shadow-sm hover:scale-105 transition-all text-xl"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Target: {jobTitle}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time profile match score and keyword gap metrics</p>
          </div>
          <button className="mt-4 md:mt-0 font-semibold text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => navigate("/")}>
            ← Analyze Another Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-5 h-full">
            <MatchScoreCard score={match_score} feedback={match_feedback} />
          </div>

          {/* 📊 Updated Gap Intelligence (Fixed Height UI) */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Gap Intelligence</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Metric 1: Competency Fit */}
                <div className="p-5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-100 dark:border-slate-800 h-auto flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Metrics Percentage</p>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Competency Fit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mr-4">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.round(match_score)}%` }}></div>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(match_score)}%</span>
                  </div>
                </div>

                {/* Metric 2: Domain Skills Overlap */}
                <div className="p-5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-100 dark:border-slate-800 h-auto flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Key Overlap</p>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Domain Skills</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mr-4">
                      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(matchedCount / (totalJobSkills || 1)) * 100}%` }}></div>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{matchedCount}/{totalJobSkills}</span>
                  </div>
                </div>

                {/* Metric 3: Gaps to Fill */}
                <div className="p-5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-100 dark:border-slate-800 h-auto flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Skill Deficit</p>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Missing Keywords Count</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Add these to improve score</span>
                    <span className="text-2xl font-bold text-amber-500 flex-shrink-0">{missing_skills.length} Words</span>
                  </div>
                </div>

                {/* Metric 4: Behavioral Soft Skills */}
                <div className="p-5 bg-slate-50 dark:bg-[#0B0F19] rounded-xl border border-slate-100 dark:border-slate-800 h-auto flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Behavioral Match</p>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Soft Skills Identification</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Extracted from text profile</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">{resume_skills?.soft?.length || 0} Found</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-6 h-full">
            <SkillsList title="Current Inventory" skills={resume_skills?.technical || []} type="current" />
          </div>
          <div className="lg:col-span-6 h-full">
            <SkillsList title="Missing Skills" skills={missing_skills || []} type="missing" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 h-full">
            <ResumeSummary summary={resume_summary} />
          </div>
          <div className="lg:col-span-6 h-full">
            <SuggestionsCard suggestions={suggestions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;