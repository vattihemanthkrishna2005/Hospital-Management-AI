import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, Download, Sparkles } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:15 AM',
  '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'
];

export default function BookingModal({ doctor, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [patientEmail, setPatientEmail] = useState('rahul@example.com');
  const [patientPhone, setPatientPhone] = useState('+91 98765 43210');
  const [symptoms, setSymptoms] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !patientEmail || !patientPhone) {
      setErrorMessage('Please fill in all required patient details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialization: doctor.specialization_name,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        symptoms: symptoms
      };

      const res = await axios.post('/api/appointments/book', payload);
      setBookedAppointment(res.data.appointment);
      setStep(3);

      // Trigger Confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onBookingSuccess) onBookingSuccess(res.data.appointment);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = () => {
    if (bookedAppointment) {
      window.open(`/api/pdf/appointment/${bookedAppointment.reference_code}`, '_blank');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '600px',
        width: '100%',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            padding: '0.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <span className="badge badge-scheduled" style={{ marginBottom: '0.4rem' }}>
            OPD Appointment Booking
          </span>
          <h2 style={{ fontSize: '1.6rem' }}>{doctor.name}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {doctor.specialization_name} • Fee: ₹{doctor.fee}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {errorMessage}
          </div>
        )}

        {/* STEP 1 & 2 Form */}
        {step !== 3 ? (
          <form onSubmit={handleBookSubmit}>
            
            {/* Date Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Calendar size={16} color="var(--accent-cyan)" /> Select Consultation Date
              </label>
              <input 
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Time Slot Picker */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Clock size={16} color="var(--accent-purple)" /> Choose Available Time Slot
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.6rem' }}>
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: selectedTime === slot ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: selectedTime === slot ? '#ffffff' : 'var(--text-secondary)',
                      border: selectedTime === slot ? 'none' : '1px solid var(--border-color)'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Info Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <User size={14} color="var(--accent-cyan)" /> Patient Full Name *
                </label>
                <input 
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <Mail size={14} color="var(--accent-purple)" /> Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-color)',
                      color: '#ffffff',
                      padding: '0.7rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <Phone size={14} color="var(--accent-emerald)" /> Phone Number *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-color)',
                      color: '#ffffff',
                      padding: '0.7rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <FileText size={14} color="var(--accent-amber)" /> Describe Symptoms / Health Notes
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Mild headache and chest tightness for 2 days..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    color: '#ffffff',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              {isSubmitting ? 'Confirming Booking...' : 'Confirm OPD Booking Now'}
            </button>

          </form>
        ) : (
          /* STEP 3: Booking Success Ticket */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '1px solid var(--accent-emerald)'
            }}>
              <CheckCircle size={36} color="var(--accent-emerald)" />
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Appointment Confirmed!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your OPD slot has been locked with {bookedAppointment.doctor_name}.
            </p>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reference ID:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  {bookedAppointment.reference_code}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                  <div style={{ fontWeight: 600 }}>{bookedAppointment.appointment_date}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                  <div style={{ fontWeight: 600 }}>{bookedAppointment.appointment_time}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Patient:</span>
                  <div style={{ fontWeight: 600 }}>{bookedAppointment.patient_name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <div><span className="badge badge-scheduled">{bookedAppointment.status}</span></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-primary"
                onClick={downloadPDF}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Download size={18} />
                Download PDF Slip
              </button>

              <button 
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close & View Portal
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
