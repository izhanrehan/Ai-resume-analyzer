// 📂 frontend/src/pages/FrontPage.js
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FrontPage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null); // 👈 1. Create a reference for the features section

  const scrollToFeatures = (e) => {
    e.preventDefault();
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' }); // 👈 2. Smooth Scroll trigger
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-start relative overflow-hidden font-sans tracking-tight">
      
      {/* 🌌 Background Glowing Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600 rounded-full filter blur-[128px] opacity-30 animate-pulse"></div>

      {/* 🛸 Hero Section (Above the fold) */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center max-w-4xl mx-auto px-6 text-center">
        
        {/* Futuristic Badge */}
        <span className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider mb-6 inline-block shadow-lg shadow-purple-500/5">
          🚀 Next-Gen ATS Scoring Portal
        </span>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Level Up Your Career with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Gemini AI Intelligence
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop guessing why you aren't getting interviews. Benchmark your profile against real job specs and let AI engineer your success.
        </p>

        {/* ⚡ Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <button
            onClick={() => navigate('/analyze')}
            className="group relative font-bold text-lg py-4 px-12 rounded-xl text-white shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-blue-500/20"
          >
            Launch Analyzer
            <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform duration-200">
              →
            </span>
          </button>
          
          <button 
            onClick={scrollToFeatures} // 👈 3. Click handle triggers smooth scroll
            className="text-slate-400 hover:text-white font-semibold text-base transition-colors duration-200"
          >
            Learn how it works
          </button>
        </div>

        {/* 📊 Tiny Footer Metrics on landing */}
        <div className="absolute bottom-10 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-6 flex justify-center gap-12 text-slate-500 text-sm font-medium tracking-wide">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Real-time Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
              <span>Zero Data Leakage</span>
            </div>
          </div>
        </div>
      </div>


      {/* 📖 4. "Learn How It Works" Section (Appears after scroll) */}
      <div ref={featuresRef} id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 border-t border-slate-800">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three simple steps to benchmark and optimize your resume using Gemini generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 Card */}
          <div className="bg-[#161B26] p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-white mb-2">1. Upload Resume</h3>
            <p className="text-sm text-slate-400">
              Drop your PDF resume. Our system extracts the raw text metrics automatically.
            </p>
          </div>

          {/* Step 2 Card */}
          <div className="bg-[#161B26] p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all duration-300">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">2. Match Job Title</h3>
            <p className="text-sm text-slate-400">
              Type your target title or let Gemini auto-detect the profile's field from the resume.
            </p>
          </div>

          {/* Step 3 Card */}
          <div className="bg-[#161B26] p-8 rounded-2xl border border-slate-800 hover:border-pink-500/50 transition-all duration-300">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">3. Score and Optimize</h3>
            <p className="text-sm text-slate-400">
              Get an overall match score, gap intelligence metrics, and smart upgrade suggestions.
            </p>
          </div>

        </div>

        {/* Call To Action at the bottom of the scroll */}
        <div className="text-center mt-20">
          <button
            onClick={() => navigate('/analyze')}
            className="font-bold py-3.5 px-10 rounded-xl text-white bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-700"
          >
            Ready to test? Try it now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;