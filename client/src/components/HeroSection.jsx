import React from 'react';
import { Search, Shield, Clock, Award, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection({ searchQuery, setSearchQuery, selectedSpec, setSelectedSpec, onOpenSymptomMatcher }) {
  return (
    <div className="glass-panel" style={{ margin: '0 20px 30px 20px', padding: '3.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Top Highlight Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--accent-cyan)'
        }}>
          <Sparkles size={16} />
          <span>Azure Serverless Cloud-Powered Healthcare</span>
        </div>

        {/* Main Title */}
        <h1 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1rem' }}>
          Your Health, Simplified. <br />
          <span className="text-gradient">Book Expert Doctors in Seconds.</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
          Schedule OPD appointments with top-rated medical specialists, manage digital prescriptions, and track live queue status in real time.
        </p>

        {/* Search Bar Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '0.6rem 0.8rem 0.6rem 1.2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)',
          maxWidth: '750px',
          margin: '0 auto 2rem auto'
        }}>
          <Search size={22} color="var(--accent-cyan)" />
          <input
            type="text"
            placeholder="Search by Doctor Name or Specialty (e.g. Cardiology, Dr. Sarah)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />

          <button 
            className="btn-primary"
            onClick={onOpenSymptomMatcher}
            style={{ background: 'var(--gradient-accent)', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={16} />
            AI Symptom Match
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <Clock size={24} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.3rem' }}>Zero Waiting</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live Queue Tracking</p>
          </div>

          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <Award size={24} color="var(--accent-purple)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.3rem' }}>50+ Doctors</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Board-Certified Specialists</p>
          </div>

          <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <Shield size={24} color="var(--accent-emerald)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.3rem' }}>100% Digital</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PDF Records & Tickets</p>
          </div>
        </div>

      </div>
    </div>
  );
}
