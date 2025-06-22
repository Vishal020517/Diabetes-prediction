import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Form from './Form.jsx'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Route for the home page */}
        <Route path="/Form" element={<Form />} /> {/* Route for the form page */}
        {/* You can add more routes here as your application grows */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);