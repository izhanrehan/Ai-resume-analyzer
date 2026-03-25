/**
 * Entry point for React application
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Added Theme Context Import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* ✅ Wrapped App with ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);