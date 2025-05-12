import React, { useState } from 'react';
import axios from 'axios';

function Analyzer() {
  const [url, setUrl] = useState('');
  const [issues, setIssues] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Adding emoji based on severity
  const getEmoji = (impact) => {
    switch (impact) {
      case 'critical':
        return '🛑';
      case 'serious':
        return '⚠️';
      case 'moderate':
        return '🔶';
      default:
        return 'ℹ️';
    }
  };

  // Function to speak the text using Speech Synthesis API
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
    setIsSpeaking(true);
    msg.onend = () => {
      setIsSpeaking(false); // Reset speaking state after speaking ends
    };
    msg.onerror = (e) => {
      console.error("Error while speaking: ", e);
      setIsSpeaking(false);
    };
  };

  // Stop the speech synthesis immediately
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Handle the analysis request
  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/analyze', { url });
      setIssues(res.data.violations);
      
      // Narrate the number of issues found
      speak(`Found ${res.data.violations.length} accessibility issues`);

      // Narrate each issue with a delay and allow stopping at any point
      res.data.violations.forEach((issue, index) => {
        setTimeout(() => {
          if (isSpeaking) {
            speak(`${getEmoji(issue.impact)} ${issue.help}: ${issue.description}`);
          }
        }, index * 3000); // Adding a delay of 3 seconds between issues
      });
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
