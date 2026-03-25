import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import ResumeUploader from '../components/ResumeUploader';
import ErrorAlert from '../components/ErrorAlert';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const HomePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExampleLoading, setIsExampleLoading] = useState(false); 
  const [error, setError] = useState('');

  const handleResumeSelected = (file) => {
    setResumeFile(file);
    setError('');
  };

  const handleLoadExample = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a Job Title first (e.g. Backend Developer) to load a specific scenario.');
      return;
    }

    try {
      setIsExampleLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/example-job`, {
        params: { title: jobTitle }
      });
      
      setJobDescription(response.data.description);
    } catch (err) {
      setError('Failed to load example job description scenario.');
    } finally {
      setIsExampleLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please upload a resume PDF');
      return;
    }

    // Checking if fields are manually filled.
    const isManualJD = jobDescription.trim().length > 0;
    const isManualTitle = jobTitle.trim().length > 0;

    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', resumeFile);

      // 1. Upload & trigger auto-detection in backend
      const uploadResponse = await axios.post(`${API_URL}/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!uploadResponse.data.success) {
        setError('Failed to extract resume text');
        setIsLoading(false);
        return;
      }

      const resumeText = uploadResponse.data.resume_text;

      // Determine final variables locally without waiting for React's Async state
      let finalTitle = jobTitle;
      let finalJD = jobDescription;

      if (!isManualTitle && uploadResponse.data.auto_title) {
        finalTitle = uploadResponse.data.auto_title;
        setJobTitle(finalTitle); // Screen update
      }

      if (!isManualJD && uploadResponse.data.auto_jd) {
        finalJD = uploadResponse.data.auto_jd;
        setJobDescription(finalJD); // Screen update
      }

      if (!finalJD.trim()) {
        setError('Please enter a job description or let AI auto-generate it from resume');
        setIsLoading(false);
        return;
      }

      // 2. Direct processing with variables
      const analysisResponse = await axios.post(`${API_URL}/analyze-resume`, {
        resume_text: resumeText,
        job_description: finalJD,
        job_title: finalTitle,
      });

      navigate('/results', {
        state: {
          result: analysisResponse.data,
          jobTitle: finalTitle || 'AI Auto-Detected Profile'
        },
      });
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-sans tracking-tight pt-10 pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Toggle Theme Button Top Right */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] shadow-sm hover:scale-105 transition-all text-xl"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Neon Header */}
        <div className="text-center mb-12">
          <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
            Powered by Gemini AI
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Benchmark your resume against industry metrics and uncover glowing keywords to optimize ATS scoring.
          </p>
        </div>

        {error && <div className="max-w-2xl mx-auto mb-8"><ErrorAlert message={error} /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Glass Card 1: Resume Input */}
          <div className="lg:col-span-5 bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between hover:border-blue-500/50 dark:hover:border-purple-500/50 transition-all duration-300">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">📄</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">1. Upload Resume</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Drag and drop your latest PDF resume</p>
              <ResumeUploader onFileSelected={handleResumeSelected} isLoading={isLoading} />
            </div>
            {resumeFile && (
              <div className="flex items-center p-3.5 mt-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                <span className="font-semibold mr-2">✓ Attached:</span> {resumeFile.name}
              </div>
            )}
          </div>

          {/* Glass Card 2: Job Specs Input */}
          <div className="lg:col-span-7 bg-white dark:bg-[#161B26] p-8 rounded-2xl shadow-sm dark:shadow-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">2. Job Specs</h2>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-500/20">
                Leave blank to auto-detect from resume
              </span>
            </div>
            
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Job Title (e.g. Senior Frontend Engineer)"
              className="w-full mb-4 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste responsibilities and requirements here..."
              className="w-full h-64 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
            
            <div className="flex items-center justify-between mt-4">
              <button 
                onClick={handleLoadExample} 
                disabled={isExampleLoading || isLoading}
                className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors ${(isExampleLoading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExampleLoading ? '⚡ Loading AI Scenario...' : 'Load Example Scenario'}
              </button>
              {jobDescription && (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Characters: {jobDescription.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || isExampleLoading || !resumeFile}
            className={`font-semibold text-lg py-4 px-16 rounded-xl text-white shadow-lg transition-all duration-300 ${
              isLoading || isExampleLoading || !resumeFile
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400 dark:text-slate-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-blue-500/20'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Evaluating with Gemini AI...</span>
              </span>
            ) : (
              'Evaluate Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;