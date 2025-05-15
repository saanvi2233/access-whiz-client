import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/about.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="about-header">
        <h1>About SightGuard</h1>
        <p className="tagline">Making the web accessible for everyone</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <div className="section-icon">👁️</div>
          <h2>Our Mission</h2>
          <p>
            At SightGuard, we believe the web should be accessible to all users regardless of ability. 
            Our mission is to empower developers and content creators to build inclusive digital experiences 
            through automated accessibility testing and education.
          </p>
        </section>

        <section className="features-section">
          <h2>Why Choose SightGuard?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Comprehensive Scanning</h3>
              <p>Detects WCAG 2.1 AA compliance issues with detailed explanations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗣️</div>
              <h3>Voice Guidance</h3>
              <p>Audio narration helps visually impaired users understand issues</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Actionable Reports</h3>
              <p>Clear prioritization of issues with remediation guidance</p>
            </div>
          </div>
        </section>

        {/* <section className="team-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, SightGuard was created by a team of developers who saw firsthand how inaccessible 
            websites create barriers for people with disabilities. What started as a class project has grown into 
            a mission-driven tool used by hundreds of organizations to improve their digital accessibility.
          </p>
          <div className="values-list">
            <div className="value-item">
              <h3>Inclusion</h3>
              <p>We design for all abilities and learning styles</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>Continually improving our detection algorithms</p>
            </div>
            <div className="value-item">
              <h3>Integrity</h3>
              <p>Honest, transparent reporting you can trust</p>
            </div>
          </div>
        </section> */}

        <section className="cta-section">
          <h2>Join Our Mission</h2>
          <p>
            Ready to make your website more accessible? Try our analyzer tool today or contact us to learn more 
            about enterprise solutions.
          </p>
          <button className="cta-button" onClick={() => navigate('/')}>
            Start Analyzing
          </button>
        </section>
      </div>
    </div>
  );
}

export default About;