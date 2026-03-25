/**
 * App Component
 * Main application router and layout
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage'; // 👈 1. Naya FrontPage import kiya
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 👈 2. Root path par FrontPage chalega ab */}
          <Route path="/" element={<FrontPage />} />
          
          {/* 👈 3. HomePage ab "/analyze" par shift hogaya hai */}
          <Route path="/analyze" element={<HomePage />} />
          
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;