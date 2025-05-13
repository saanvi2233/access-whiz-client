import React, { useState } from 'react';
import axios from 'axios';
import '../style/analyzer.css';

function Analyzer() {
  const [url, setUrl] = useState('');
  const [issues, setIssues] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);

  // Emoji based on impact
  const getEmoji = (impact) => {
    switch (impact) {
      case 'critical': return '🛑';
      case 'serious': return '⚠️';
      case 'moderate': return '🔶';
      default: return 'ℹ️';
    }
  };

  // Speak text and return a promise that resolves after speech ends
  const speak = (text) => {
    return new Promise((resolve) => {
      const msg = new SpeechSynthesisUtterance(text);
      msg.onend = resolve;
      msg.onerror = resolve;
      window.speechSynthesis.speak(msg);
    });
  };

  // Stop speech and update state
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setShouldStop(true);
  };

  // Narrate all issues one by one
  const narrateIssues = async (violations) => {
    setIsSpeaking(true);
    setShouldStop(false);

    await speak(`Found ${violations.length} accessibility issues.`);

    for (let i = 0; i < violations.length; i++) {
      if (shouldStop) break;
      const issue = violations[i];
      const text = `${getEmoji(issue.impact)} ${issue.help}: ${issue.description}`;
      await speak(text);
    }

    setIsSpeaking(false);
  };

  // Analyze the URL and start narration
  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/analyze', { url });
      const violations = res.data.violations;
      setIssues(violations);
      narrateIssues(violations);
    } catch (err) {
      console.error('Error analyzing:', err);
    }
  };

  return (
    <div>
      <h1>Accessibility Analyzer</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
      />
      <button onClick={handleAnalyze} disabled={isSpeaking}>
        {isSpeaking ? 'Analyzing...' : 'Analyze'}
      </button>

      <button onClick={stopSpeaking} disabled={!isSpeaking}>
        Stop
      </button>

      {issues.length > 0 && (
        <ul>
          {issues.map((issue, idx) => (
            <li key={idx}>
              <strong>{getEmoji(issue.impact)} {issue.help}</strong>: {issue.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Analyzer;
