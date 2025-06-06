import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/analyzer.css';

function Analyzer() {
  const [url, setUrl] = useState('');
  const [issues, setIssues] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pastAnalyse, setPastAnalyse] = useState([]);
  const navigate = useNavigate();

  // Emoji based on impact
  const getEmoji = (impact) => {
    switch (impact) {
      case 'critical': return '🛑';
      case 'serious': return '⚠️';
      case 'moderate': return '🔶';
      default: return 'ℹ️';
    }
  };

  // Color based on impact
  const getColor = (impact) => {
    switch (impact) {
      case 'critical': return '#dc3545';
      case 'serious': return '#fd7e14';
      case 'moderate': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  const fetchPastAnalyses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/analyze/all');
      setPastAnalyse(res.data);
    } catch (err) {
      console.error('Error fetching past analyses:', err);
    }
  };

  const speak = (text) => {
    return new Promise((resolve) => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.onend = resolve;
      msg.onerror = resolve;
      window.speechSynthesis.speak(msg);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setShouldStop(true);
  };

  const narrateIssues = async (violations) => {
    setIsSpeaking(true);
    setShouldStop(false);

    await speak(`Found ${violations.length} accessibility issues.`);

    for (let i = 0; i < violations.length; i++) {
      if (shouldStop) break;
      const issue = violations[i];
      const text = `${issue.help}: ${issue.description}`;
      await speak(text);
    }

    setIsSpeaking(false);
  };

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post('http://localhost:5000/analyze', { url });
      const violations = res.data.violations;
      setIssues(violations);
      narrateIssues(violations);

      // Save the result
await axios.post('http://localhost:5000/analyze/save', {
  url,
  violations
});
    } catch (err) {
      console.error('Error analyzing:', err);
      setError('Failed to analyze the website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Issue', 'Description', 'Impact'];
    const rows = issues.map(issue => [issue.help, issue.description, issue.impact]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'accessibility_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchPastAnalyses();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (


    <div className="analyzer-container">
      
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="analyzer-header">
        <h1>Accessibility Analyzer</h1>
        <p className="subtitle">Test any website for accessibility issues and get detailed recommendations</p>
      </div>

      <div className="input-container">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., https://example.com)"
          className="url-input"
          disabled={isLoading || isSpeaking}
        />
        <div className="button-group">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || isSpeaking || !url}
            className="analyze-button"
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner"></span> Analyzing...
              </span>
            ) : (
              'Analyze Website'
            )}
          </button>
          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className="stop-button"
          >
            Stop Narration
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {issues.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h2>Accessibility Issues Found: {issues.length}</h2>
            <div className="impact-legend">
              <span><span className="legend-dot critical"></span> Critical</span>
              <span><span className="legend-dot serious"></span> Serious</span>
              <span><span className="legend-dot moderate"></span> Moderate</span>
              <span><span className="legend-dot minor"></span> Minor</span>
            </div>
          </div>

          <div className="issues-list">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className="issue-card"
                style={{ borderLeft: `4px solid ${getColor(issue.impact)}` }}
              >
                <div className="issue-header">
                  <span className="issue-emoji">{getEmoji(issue.impact)}</span>
                  <h3 className="issue-title">{issue.help}</h3>
                  <span className="impact-badge" style={{ backgroundColor: getColor(issue.impact) }}>
                    {issue.impact}
                  </span>
                </div>
                <p className="issue-description">{issue.description}</p>
                {issue.helpUrl && (
                  <a
                    href={issue.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learn-more-link"
                  >
                    Learn how to fix this →
                  </a>
                )}
              </div>
            ))}
          </div>

          <button
            className="export-button"
            onClick={exportToCSV}
            disabled={issues.length === 0}
          >
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default Analyzer;
