import React from 'react';
import { Star, Clock, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

export default function DoctorCard({ doctor, onBookSlot }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', height: '100%' }}>
      
      {/* Top Profile Header */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
        <img 
          src={doctor.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300'} 
          alt={doctor.name}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--border-glow)'
          }}
        />
        <div style={{ flex: 1 }}>
          <span className="badge badge-scheduled" style={{ marginBottom: '0.4rem', fontSize: '0.75rem' }}>
            {doctor.specialization_name}
          </span>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{doctor.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {doctor.experience} Years Experience
          </p>
        </div>
      </div>

      {/* Rating & Fee Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.2rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doctor.rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(140+ reviews)</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            ₹{doctor.fee}
          </div>
        </div>
      </div>

      {/* Availability Schedule Info */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={15} color="var(--accent-cyan)" />
          <span><strong>Days:</strong> {doctor.available_days}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={15} color="var(--accent-purple)" />
          <span><strong>Hours:</strong> {doctor.available_hours}</span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        className="btn-primary" 
        onClick={() => onBookSlot(doctor)}
        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
      >
        <CheckCircle2 size={18} />
        Book OPD Appointment
      </button>

    </div>
  );
}
