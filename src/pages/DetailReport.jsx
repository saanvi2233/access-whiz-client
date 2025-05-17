import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/reports.css";

function DetailReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/analyze/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const getColor = (impact) => {
    switch (impact) {
      case 'critical': return '#dc3545';
      case 'serious': return '#fd7e14';
      case 'moderate': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  return (
    <div className="detail-report-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {loading ? (
        <p>Loading report details...</p>
      ) : report ? (
        <div className="detail-content">
          <h2>Accessibility Report for: {report.url}</h2>
          <p><strong>Created:</strong> {new Date(report.createdAt).toLocaleString()}</p>
          <p><strong>Total Issues:</strong> {report.violations.length}</p>

          <div className="violation-details">
            {report.violations.map((violation, index) => (
              <div key={index} className="violation-card">
                <h4 style={{ color: getColor(violation.impact) }}>
                  {violation.id} - {violation.impact}
                </h4>
                <p><strong>Description:</strong> {violation.description}</p>
                <p>
                  <strong>Help:</strong> <a href={violation.helpUrl} target="_blank" rel="noopener noreferrer">{violation.help}</a>
                </p>
                <ul>
                  {violation.nodes.map((node, idx) => (
                    <li key={idx}>
                      <code>{node.html}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No report found for this ID.</p>
      )}
    </div>
  );
}

export default DetailReport;
