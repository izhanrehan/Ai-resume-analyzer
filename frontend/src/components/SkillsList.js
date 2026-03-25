import React from "react";

const SkillsList = ({ title, skills = [], type = "current" }) => {
  return (
    <div className="bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between transition-colors duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{title}</h2>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, index) => (
              <span 
                key={`${skill}-${index}`} 
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                  type === "missing" 
                  ? "bg-rose-100 dark:bg-[#2A1720] text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" 
                  : "bg-blue-100 dark:bg-[#1C2535] text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No skills inventory specs found.</p>
        )}
      </div>
      
      {skills.length > 0 && (
        <p className="mt-6 text-sm font-bold text-slate-500 dark:text-slate-400">Total Specs: {skills.length}</p>
      )}
    </div>
  );
};

export default SkillsList;