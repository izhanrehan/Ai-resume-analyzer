import React from 'react';

const LoadingSpinner = ({ message = 'Analyzing your resume...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-[#0B0F19] min-h-screen transition-colors duration-300">
      <div className="loading-spinner mb-4 border-slate-300 dark:border-slate-700 border-t-blue-500 h-12 w-12 border-4 rounded-full animate-spin"></div>
      <p className="text-slate-800 dark:text-white font-bold text-lg">{message}</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">This may take a few moments</p>
    </div>
  );
};

export default LoadingSpinner;