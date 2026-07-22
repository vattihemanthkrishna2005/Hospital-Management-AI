import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, RefreshCw, User, FileText, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function PatientPortal({ onNavigateToBook }) {
  const [patientEmail, setPatientEmail] = useState('rahul@example.com');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/appointments/patient/${encodeURIComponent(patientEmail)}`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientEmail]);

  const downloadPDF = (refCode) => {
    window.open(`/api/pdf/appointment/${refCode}`, '_blank');
  };

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-scheduled" style={{ marginBottom: '0.4rem' }}>
              Patient Self-Service Dashboard
            </span>
            <h2 style={{ fontSize: '1.8rem' }}>My Appointment Bookings</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Track live queue status and download official PDF visitor slips
            </p>
          </div>

          {/* Email Filter input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="email"
              placeholder="Filter by Email..."
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
            <button 
              className="btn-secondary" 
              onClick={fetchAppointments}
              style={{ padding: '0.5rem 0.75rem' }}
            >
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Calendar size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Active Appointments Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You haven't scheduled any OPD consultations yet.
            </p>
            <button className="btn-primary" onClick={onNavigateToBook}>
              Book an OPD Appointment Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {appointments.map((app) => (
              <div key={app.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                <div>
                  {/* Top Bar with Reference & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                      {app.reference_code}
                    </span>
                    <span className={`badge badge-${app.status.toLowerCase().replace(' ', '-')}`}>
                      {app.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{app.doctor_name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
                    {app.specialization} Department
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="var(--accent-purple)" />
                      <span><strong>Date:</strong> {app.appointment_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={15} color="var(--accent-emerald)" />
                      <span><strong>Time Slot:</strong> {app.appointment_time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={15} color="var(--accent-amber)" />
                      <span><strong>Patient:</strong> {app.patient_name}</span>
                    </div>
                    {app.symptoms && (
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Symptoms Note:</span>
                        {app.symptoms}
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Action Button */}
                <button 
                  className="btn-secondary" 
                  onClick={() => downloadPDF(app.reference_code)}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                >
                  <Download size={16} />
                  Download PDF Visitor Slip
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
