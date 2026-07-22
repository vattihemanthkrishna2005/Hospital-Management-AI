import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Stethoscope, Download, RefreshCw, Activity, Pill } from 'lucide-react';
import axios from 'axios';

export default function PreviousRecords() {
  const [patientEmail, setPatientEmail] = useState('rahul@example.com');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/records/patient/${encodeURIComponent(patientEmail)}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [patientEmail]);

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-completed" style={{ marginBottom: '0.4rem' }}>
              Patient Medical Vault
            </span>
            <h2 style={{ fontSize: '1.8rem' }}>Previous Medical Records & Prescriptions</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Access diagnostic reports, treatment histories, and doctor clinical notes
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="email"
              placeholder="Search Email..."
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button className="btn-secondary" onClick={fetchMedicalRecords} style={{ padding: '0.5rem 0.75rem' }}>
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Timeline of Previous Records */}
        {records.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={48} color="var(--accent-emerald)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Medical Records Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              No historical health records are attached to this patient email.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {records.map((rec) => (
              <div key={rec.id} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
                
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-completed" style={{ marginBottom: '0.4rem' }}>
                      {rec.specialization}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-cyan)' }}>{rec.diagnosis}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Consulting Physician: <strong>{rec.doctor_name}</strong>
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Calendar size={15} color="var(--accent-purple)" /> Visit Date: <strong>{rec.visit_date}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                  
                  {/* Prescription Box */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>
                      <Pill size={16} /> Prescribed Medications
                    </div>
                    <pre style={{ fontFamily: 'inherit', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                      {rec.prescription}
                    </pre>
                  </div>

                  {/* Lab Notes Box */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>
                      <Activity size={16} /> Diagnostic Lab Notes
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {rec.lab_notes || 'No specific lab notes recorded.'}
                    </p>

                    {rec.follow_up_date && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                        🗓️ Follow-up Scheduled: <strong>{rec.follow_up_date}</strong>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
