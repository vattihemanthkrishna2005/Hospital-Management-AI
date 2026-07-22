import React from 'react';
import { HeartPulse, Brain, Baby, Bone, Sparkles, Stethoscope, Layers } from 'lucide-react';

const specIcons = {
  Cardiology: HeartPulse,
  Neurology: Brain,
  Pediatrics: Baby,
  Orthopedics: Bone,
  Dermatology: Sparkles,
  'General Medicine': Stethoscope
};

export default function DepartmentGrid({ specializations, selectedSpec, setSelectedSpec }) {
  return (
    <div style={{ margin: '0 20px 30px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Clinical Departments</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Filter doctors by medical discipline
          </p>
        </div>

        {selectedSpec !== 'All' && (
          <button 
            className="btn-secondary" 
            onClick={() => setSelectedSpec('All')}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
          >
            Reset Filter (Show All)
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* All Specializations Chip */}
        <div 
          className="glass-card"
          onClick={() => setSelectedSpec('All')}
          style={{
            padding: '1.2rem',
            cursor: 'pointer',
            borderColor: selectedSpec === 'All' ? 'var(--accent-cyan)' : 'var(--border-color)',
            background: selectedSpec === 'All' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Layers size={20} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem' }}>All Departments</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show All Doctors</span>
          </div>
        </div>

        {specializations.map((spec) => {
          const IconComp = specIcons[spec.name] || Stethoscope;
          const isSelected = selectedSpec === spec.name;

          return (
            <div 
              key={spec.id || spec.name}
              className="glass-card"
              onClick={() => setSelectedSpec(spec.name)}
              style={{
                padding: '1.2rem',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-color)',
                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div style={{
                background: isSelected ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.6rem',
                borderRadius: '12px',
                display: 'flex'
              }}>
                <IconComp size={20} color={isSelected ? '#ffffff' : 'var(--accent-cyan)'} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem' }}>{spec.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specialist Team</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
