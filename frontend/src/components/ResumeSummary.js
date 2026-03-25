import React from "react";

const ResumeSummary = ({ summary = "" }) => {
  return (
    <div className="bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Context Synopsis</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
        {summary || "Synopsis vectors not available."}
      </p>
    </div>
  );
};

export default ResumeSummary;