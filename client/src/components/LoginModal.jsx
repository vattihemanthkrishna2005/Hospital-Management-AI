import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function LoginModal({ onClose, onLoginSuccess, isMandatory = false }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('pass123!');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ADMIN');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fillQuickDemo = (targetRole) => {
    if (targetRole === 'ADMIN') {
      setEmail('admin');
      setPassword('pass123!');
      setRole('ADMIN');
    } else {
      setEmail('rahul@example.com');
      setPassword('patient123');
      setRole('PATIENT');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister 
        ? { name, email, password, phone, role }
        : { email, password };

      const res = await axios.post(endpoint, payload);
      
      const { token, user } = res.data;
      localStorage.setItem('medicare_token', token);
      localStorage.setItem('medicare_user', JSON.stringify(user));
      
      // Set global Axios Header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (onLoginSuccess) onLoginSuccess(user);
      if (onClose && !isMandatory) onClose();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 10, 20, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.25rem',
        position: 'relative',
        boxShadow: '0 0 40px rgba(56, 189, 248, 0.25)',
        border: '1px solid var(--border-glow)'
      }}>
        
        {/* Optional Close Button if not mandatory gate */}
        {!isMandatory && onClose && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem', right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none', color: '#ffffff',
              padding: '0.4rem', borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            width: '52px', height: '52px',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            <Lock size={26} color="#ffffff" />
          </div>
          
          <span className="badge badge-scheduled" style={{ marginBottom: '0.4rem' }}>
            🔒 Mandatory Authentication Portal
          </span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>
            {isRegister ? 'Create Account' : 'Sign In to MediCare Hub'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Authentication required to access hospital booking & admin services.
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            padding: '0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Hardcoded Credentials Quick Fill Box */}
        {!isRegister && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              ⚡ QUICK TESTING CREDENTIALS (CLICK TO AUTO-FILL):
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillQuickDemo('ADMIN')}
                style={{
                  flex: 1, padding: '0.45rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem', fontWeight: 700,
                  background: role === 'ADMIN' ? 'var(--gradient-accent)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff', border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Admin (admin / pass123!)
              </button>

              <button
                type="button"
                onClick={() => fillQuickDemo('PATIENT')}
                style={{
                  flex: 1, padding: '0.45rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem', fontWeight: 700,
                  background: role === 'PATIENT' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff', border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <UserCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Patient (rahul / patient123)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Full Name *
              </label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Alex Vance"
                style={{
                  width: '100%', background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)', color: '#ffffff',
                  padding: '0.7rem', borderRadius: 'var(--radius-md)', outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Username or Email Address *
            </label>
            <input 
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin or admin@medicare.com"
              style={{
                width: '100%', background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)', color: '#ffffff',
                padding: '0.7rem', borderRadius: 'var(--radius-md)', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Password *
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)', color: '#ffffff',
                padding: '0.7rem', borderRadius: 'var(--radius-md)', outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {isSubmitting ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Authenticate & Enter UI')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {isRegister ? 'Already registered? Sign In' : "Don't have an account? Register new account"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
