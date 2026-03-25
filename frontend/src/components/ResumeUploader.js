/**
 * ResumeUploader Component
 * Handles resume file upload with drag and drop functionality
 */
import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const ResumeUploader = ({ onFileSelected, isLoading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    setFileName(file.name);
    onFileSelected(file);
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 h-64 flex flex-col justify-center items-center ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F19] hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        <FiUpload className="mx-auto text-4xl text-slate-400 dark:text-slate-500 mb-3 transition-colors duration-300" />
        
        <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1 transition-colors duration-300">
          Drop your resume here
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm transition-colors duration-300">
          or click to select a PDF file
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={`py-2 px-6 rounded-lg font-semibold text-sm text-white shadow-md transition-all duration-300 ${
            isLoading 
              ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/20'
          }`}
        >
          {isLoading ? 'Uploading...' : 'Select PDF'}
        </button>
        
        {fileName && (
          <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-3">
            ✓ {fileName} selected
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;