import React from "react";

const SuggestionsCard = ({ suggestions = [] }) => {
  return (
    <div className="bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Smart Corrections</h2>

      {suggestions.length > 0 ? (
        <ul className="space-y-4">
          {suggestions.map((item, index) => (
            <li key={index} className="flex items-start text-sm text-slate-700 dark:text-slate-300 font-semibold">
              <span className="text-blue-500 dark:text-blue-400 mr-3 mt-1 font-bold">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">Everything checks out well.</p>
      )}
    </div>
  );
};

export default SuggestionsCard;