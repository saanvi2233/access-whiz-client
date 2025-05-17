import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/reports.css";

function Reports() { 
    const [pastAnalyse, setPastAnalyse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();


     const fetchPastAnalyses = async () => {
        try {
          const res = await axios.get('http://localhost:5000/analyze/all');
          setPastAnalyse(res.data);
        } catch (err) {
          console.error('Error fetching past analyses:', err);
        }
        finally{
            setIsLoading(false);
        }
      };

      useEffect(() => {
        setIsLoading(true);
        fetchPastAnalyses();
      }, []);

 const getSeverityCounts = (violations) => {
    return violations.reduce((acc, violation) => {
      acc[violation.impact] = (acc[violation.impact] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="reports-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <header className="reports-header">
        <h1>Past Analysis Reports</h1>
        <p className="subtitle">Review and export your historical accessibility scans</p>
      </header>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          Loading reports...
        </div>
      ) : pastAnalyse.length > 0 ? (
        <div className="reports-grid">
          {pastAnalyse.map((report, index) => {
            const severityCounts = getSeverityCounts(report.violations);
            
            return (
              <div key={index} className="report-card">
                <div className="report-header">
                  <h3>{new URL(report.url).hostname}</h3>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="report-stats">
                  <div className="stat-item">
                    <span className="stat-value">{report.violations.length}</span>
                    <span className="stat-label">Total Issues</span>
                  </div>
                  <div className="severity-breakdown">
                    {Object.entries(severityCounts).map(([impact, count]) => (
                      <div key={impact} className="severity-item">
                        <span 
                          className="severity-dot" 
                          style={{ backgroundColor: getColor(impact) }}
                        ></span>
                        {count} {impact}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-actions">
                {/* <button
            className="view-details-btn"
            onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
            >
            {expandedIndex === index ? "Hide Details" : "View Details"}
            </button>

                    {expandedIndex === index && (
        <div className="violation-details">
            {report.violations.map((violation, vIndex) => (
            <div key={vIndex} className="violation-card">
                <h4>{violation.id} - {violation.impact}</h4>
                <p><strong>Description:</strong> {violation.description}</p>
                <p><strong>Help:</strong> <a href={violation.helpUrl} target="_blank" rel="noopener noreferrer">{violation.help}</a></p>
                <ul>
                {violation.nodes.map((node, nIndex) => (
                    <li key={nIndex}>
                    <code>{node.html}</code>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
)}

 */}
                <button
                className="view-details-btn"
                onClick={() => navigate(`/report/${report._id}`)}
                >
                View Details
                </button>

                  <button className="export-btn">
                    Export Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-reports">
          <p>No past analyses found. Run your first accessibility scan!</p>
        </div>
      )}
    </div>
  );
}
// / Reuse your existing color function or add to reports.css
const getColor = (impact) => {
  switch (impact) {
    case 'critical': return '#dc3545';
    case 'serious': return '#fd7e14';
    case 'moderate': return '#ffc107';
    default: return '#17a2b8';
  }
};

export default Reports;