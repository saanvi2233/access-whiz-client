import React from 'react';
import '../style/dashboard.css'; // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome to SightGuard: Your partner in accessibility</h1>
        <p className="subtitle">Scan, analyze, and improve your website's accessibility</p>
      </header>

       <div className="dashboard-cards">
        <div className="card analyzer-card">
          <div className="card-icon">🔍</div>
          <h3>Run Analyzer</h3>
          <p>Check any website for accessibility violations and get detailed recommendations.</p>
          <Link to="/analyzer" className="card-button">
            Start Analysis
          </Link>
        </div>

        <div className="card reports-card">
          <div className="card-icon">📊</div>
          <h3>View Reports</h3>
          <p>Export or review past analysis to track your accessibility improvements over time.</p>
          {/* <button className="card-button" > View Past Reports</button> */}
           <Link to="/reports" className="card-button">
            View Past Reports
          </Link>
        </div>

        <div className="card learn-card">
          <div className="card-icon">📚</div>
          <h3>AI Fix Generator</h3>
          <p>    Instantly get AI-powered accessibility fixes for your HTML snippets and helpful WCAG guides.
</p>
 <Link to="/learn-more" className="card-button">
          Try It Now
          </Link>        </div>
      </div>
    </div>
  );
}

export default Dashboard;