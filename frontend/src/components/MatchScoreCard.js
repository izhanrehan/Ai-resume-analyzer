import React from "react";

const MatchScoreCard = ({ score = 0, feedback = "" }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const getProgressColor = (value) => {
    if (value >= 75) return "#10b981"; // Emerald
    if (value >= 55) return "#3b82f6"; // Blue
    if (value >= 35) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const progressColor = getProgressColor(safeScore);

  return (
    <div className="bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between transition-colors duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Overall Match</h2>

        <div className="flex justify-center mb-8">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-50 dark:bg-[#0B0F19] border-8 border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{Math.round(safeScore)}%</span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6 transition-colors duration-300">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${safeScore}%`, backgroundColor: progressColor }}
          />
        </div>

        <p className="text-center text-md font-semibold text-slate-700 dark:text-slate-300 mb-6">{feedback}</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-auto transition-colors duration-300">
        <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed font-semibold">
          💡 Focus on adding missing keywords to your resume profile to maximize evaluation weights.
        </p>
      </div>
    </div>
  );
};

export default MatchScoreCard;