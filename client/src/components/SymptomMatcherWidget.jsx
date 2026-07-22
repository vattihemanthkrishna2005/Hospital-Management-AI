import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ArrowRight, Stethoscope, Lightbulb, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import DoctorCard from './DoctorCard';

export default function SymptomMatcherWidget({ onBookDoctor }) {
  const [symptomText, setSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [matchResult, setMatchResult] = useState(null);

  const [isLowPower, setIsLowPower] = useState(true);

  // Animated loading step messages for transparent reasoning UX
  const loadingMessages = [
    '⚡ Initializing Groq Llama-3.1 AI Engine (Low Power Triage Mode)...',
    '🛡️ Scanning symptom keywords & checking emergency red-flags...',
    '🏥 Matching optimal hospital department & specialist doctors...'
  ];

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setIsAnalyzing(true);
    setMatchResult(null);

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
                Describe your symptoms in simple words. Our Groq-powered AI finds the right specialist & pre-consultation guidance.
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
            <span>{isLowPower ? '⚡ Low-Power Mode (Ultra Fast)' : '🧠 Deep Triage Mode'}</span>
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
              disabled={isAnalyzing}
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
              {isAnalyzing ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
              {isAnalyzing ? 'Reasoning & Processing...' : 'Analyze & Find Specialist Doctor'}
            </button>

            {/* Quick Sample Prompts */}
            <button
              type="button"
              className="btn-secondary"
              disabled={isAnalyzing}
              onClick={() => setSymptomText('Sharp chest pain after climbing stairs and rapid heartbeat')}
              style={{ fontSize: '0.85rem' }}
            >
              Try: "Chest Pain & Palpitations"
            </button>

            <button
              type="button"
              className="btn-secondary"
              disabled={isAnalyzing}
              onClick={() => setSymptomText('Joint stiffness, knee pain, and difficulty walking')}
              style={{ fontSize: '0.85rem' }}
            >
              Try: "Knee & Joint Pain"
            </button>
          </div>
        </form>

        {/* AI REASONING / THINKING LOADING BANNER */}
        {isAnalyzing && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)'
          }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.2)',
              padding: '0.85rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(168, 85, 247, 0.5)'
            }}>
              <Activity size={26} color="var(--accent-purple)" className="pulse" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.05em' }}>
                  GROQ AI REASONING ENGINE ACTIVE
                </span>
                <span style={{ fontSize: '0.7rem', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Low-Power Mode
                </span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
                {loadingMessages[loadingStep]}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Processing symptoms in under 500ms without burning excessive token compute.
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {matchResult && (
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            
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
                <ShieldCheck size={14} color="var(--accent-cyan)" />
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
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MATCHED MEDICAL DEPARTMENT</span>
                <h3 style={{ fontSize: '1.7rem', color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>
                  {matchResult.matchedDepartment} Department
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {matchResult.advice}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</span>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {matchResult.confidenceScore}%
                </div>
              </div>
            </div>

            {/* PRE-CONSULTATION TIPS & PREPARATION CHECKLIST */}
            {matchResult.preConsultationTips && matchResult.preConsultationTips.length > 0 && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Lightbulb size={20} color="var(--accent-amber)" />
                  <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
                    💡 Pre-Consultation Preparation Checklist (Before Meeting Doctor)
                  </h4>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {matchResult.preConsultationTips.map((tip, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Doctors Grid */}
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
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
