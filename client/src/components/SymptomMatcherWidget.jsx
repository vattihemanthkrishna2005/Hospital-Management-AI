import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight, Stethoscope } from 'lucide-react';
import axios from 'axios';
import DoctorCard from './DoctorCard';

export default function SymptomMatcherWidget({ onBookDoctor }) {
  const [symptomText, setSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const [isLowPower, setIsLowPower] = useState(true);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await axios.post('/api/symptoms/match', { 
        text: symptomText,
        lowPowerMode: isLowPower
      });
      setMatchResult(res.data);
    } catch (err) {
      console.error('Error matching symptoms:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--gradient-accent)',
              padding: '0.6rem',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <Sparkles size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem' }} className="text-gradient-purple">
                Smart AI Symptom Matcher
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Describe how you feel in simple words. Our Groq-powered AI matches you with the right specialist.
              </p>
            </div>
          </div>

          {/* Low Power Mode Toggle Badge */}
          <button
            type="button"
            onClick={() => setIsLowPower(!isLowPower)}
            style={{
              background: isLowPower ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${isLowPower ? 'var(--accent-emerald)' : 'var(--accent-indigo)'}`,
              color: isLowPower ? 'var(--accent-emerald)' : '#a5b4fc',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{isLowPower ? '⚡ Low-Power Mode (Ultra Fast)' : '🧠 Deep Reasoning Mode'}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({isLowPower ? 'llama-3.1-8b' : 'llama-3.3-70b'})</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleMatch} style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea 
              rows={3}
              placeholder="e.g. I have a throbbing headache on the right side of my head, dizziness, and mild nausea since morning..."
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-glow)',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isAnalyzing || !symptomText.trim()}
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Sparkles size={18} />
              {isAnalyzing ? 'Analyzing Symptoms...' : 'Analyze & Find Specialist Doctor'}
            </button>

            {/* Quick Sample Prompts */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSymptomText('Sharp chest pain after climbing stairs and rapid heartbeat')}
              style={{ fontSize: '0.85rem' }}
            >
              Try: "Chest Pain & Palpitations"
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSymptomText('Joint stiffness, knee pain, and difficulty walking')}
              style={{ fontSize: '0.85rem' }}
            >
              Try: "Knee & Joint Pain"
            </button>
          </div>
        </form>

        {/* Analysis Results View */}
        {matchResult && (
          <div className="glass-card" style={{ padding: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            
            {/* Engine Used Info Badge */}
            {matchResult.engineUsed && (
              <div style={{ 
                marginBottom: '1rem', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px'
              }}>
                <span>Engine:</span>
                <strong style={{ color: '#e2e8f0' }}>{matchResult.engineUsed}</strong>
              </div>
            )}

            {/* Emergency Red Flag Alert */}
            {matchResult.isEmergency && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid var(--accent-rose)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-rose)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertTriangle size={24} />
                <div>
                  <strong>{matchResult.emergencyWarning}</strong>
                </div>
              </div>
            )}

            {/* Department Match Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MATCHED MEDICAL DEPARTMENT</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-cyan)' }}>
                  {matchResult.matchedDepartment} Department
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {matchResult.advice}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {matchResult.confidenceScore}%
                </div>
              </div>
            </div>

            {/* Recommended Doctors Grid */}
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={18} color="var(--accent-cyan)" />
              Recommended Specialists for {matchResult.matchedDepartment}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {matchResult.recommendedDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onBookSlot={onBookDoctor} />
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

