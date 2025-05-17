import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Analyzer from './components/Analyzer';
import Dashboard from './components/Dashboard.jsx';
import About from './pages/About';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <div className="nav-header">
            <h2 className="app-title">
              <span className="logo-icon">👁️</span>
              SightGuard
            </h2>
            <span className="app-subtitle">SightGuard Dashboard</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                <span className="link-icon">📊</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/analyzer" className="nav-link">
                <span className="link-icon">🔍</span>
                Analyzer Tool
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                <span className="link-icon">ℹ️</span>
                About
              </Link>
            </li>
          </ul>
        </nav>

        <main className="app-main">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/about" element={<About />} />
              <Route path="/reports" element={<Reports/>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;