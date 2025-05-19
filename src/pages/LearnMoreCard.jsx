import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/learnMoreCard.css';

const LearnMoreCard = () => {
  const [inputCode, setInputCode] = useState('');
  const [aiFix, setAiFix] = useState('');
  const [guideLink, setGuideLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleFixCode = async () => {
    if (!inputCode.trim()) {
      setErrorMsg("Please paste some HTML code first.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setAiFix('');
    setGuideLink('');

    try {
      const response = await axios.post('http://localhost:5000/api/fix-accessibility', {
        htmlCode: inputCode,
      });

      setAiFix(response.data.suggestion || 'No suggestion returned.');
      setGuideLink(response.data.guide || '');
    } catch (error) {
      console.error(error);
      setErrorMsg('Something went wrong while contacting AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learn-more-card">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
      
      <h2 className="card-title">
        <span role="img" aria-label="brain">🧠</span>
        AI Fix Generator
      </h2>
      
      <p className="card-description">
        Paste an HTML snippet below and get an AI-generated accessibility fix along with a helpful guide.
      </p>

      <textarea
        className="code-input"
        placeholder="E.g. <img src='logo.png'>"
        rows={5}
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
      />

      <button
        className="submit-button"
        onClick={handleFixCode}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Fixing...
          </>
        ) : (
          'Fix It with AI'
        )}
      </button>

      {errorMsg && (
        <div className="error-message">
          ⚠️ {errorMsg}
        </div>
      )}

      {aiFix && (
        <div className="ai-suggestion">
          <h3 className="suggestion-title">
            <span role="img" aria-label="check">✅</span>
            AI Suggestion:
          </h3>
          <pre className="code-snippet">{aiFix}</pre>

          {guideLink && (
            <a
              href={guideLink}
              className="guide-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Detailed Guide
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnMoreCard;