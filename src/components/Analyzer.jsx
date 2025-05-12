import React,{useState} from 'react';
import axios from 'axios';

function Analyzer() {
    const [url, setUrl] = useState('');
  const [issues, setIssues] = useState([]);

  //adding emoji
  const getEmoji=(impact)=>{
    switch(impact){
      case 'critical':
        return '🛑';
      case 'serious':
        return '⚠️';
      case 'moderate':
        return '🔶';
      default:
        return 'ℹ️';
    }
  }


 const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/analyze', { url });
      setIssues(res.data.violations);
    } catch (err) {
      console.error('Error analyzing:', err);
    }
  };

return (
    <div>
      <h1>Accessibility Analyzer</h1>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter website URL" />
      <button onClick={handleAnalyze}>Analyze</button>

      {issues.length > 0 && (
        <ul>
          {issues.map((issue, idx) => (
            <li key={idx}>
              <strong>{getEmoji(issue.impact)}{issue.help}</strong>: {issue.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Analyzer;