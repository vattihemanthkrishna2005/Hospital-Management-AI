import React from 'react';
import { Activity, Calendar, ShieldCheck, Stethoscope, FileText, Sparkles, LogIn, LogOut, User, LayoutDashboard, Users, ClipboardList } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenLogin, onLogout }) {
  const isAdmin = currentUser && currentUser.role === 'ADMIN';

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: '15px', zIndex: 100, margin: '15px 20px', padding: '0.85rem 1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
          }}>
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="text-gradient">
              MediCare Hub
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-4px' }}>
              Hospital Management & Appointment System
            </span>
          </div>
        </div>

        {/* Navigation Tabs — Role-Based */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>

          {/* Common: Find Doctors (visible to all) */}
          <button 
            className="btn-secondary"
            onClick={() => setActiveTab('home')}
            style={activeTab === 'home' ? { borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.1)' } : {}}
          >
            <Stethoscope size={18} />
            Find Doctors & Book
          </button>

          {/* Patient-Only Tabs */}
          {!isAdmin && (
            <>
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('symptom-matcher')}
                style={activeTab === 'symptom-matcher' ? { borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)', background: 'rgba(168, 85, 247, 0.1)' } : {}}
              >
                <Sparkles size={18} color="var(--accent-purple)" />
                AI Symptom Matcher
              </button>

              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('my-appointments')}
                style={activeTab === 'my-appointments' ? { borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.1)' } : {}}
              >
                <Calendar size={18} />
                My Appointments
              </button>

              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('medical-records')}
                style={activeTab === 'medical-records' ? { borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)' } : {}}
              >
                <FileText size={18} />
                Previous Records
              </button>
            </>
          )}

          {/* Admin-Only Tab */}
          {isAdmin && (
            <button 
              className="btn-secondary"
              onClick={() => setActiveTab('admin-dashboard')}
              style={activeTab === 'admin-dashboard' ? { borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)' } : {}}
            >
              <ShieldCheck size={18} />
              Admin Control Panel
            </button>
          )}
        </nav>

        {/* User Auth & RBAC State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <User size={16} color="var(--accent-cyan)" />
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, display: 'block' }}>{currentUser.name}</span>
                <span style={{ color: isAdmin ? 'var(--accent-amber)' : 'var(--accent-cyan)', fontSize: '0.7rem' }}>
                  [{currentUser.role}]
                </span>
              </div>
              <button 
                onClick={onLogout}
                style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', marginLeft: '0.35rem' }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary" 
              onClick={onOpenLogin}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <LogIn size={16} /> Sign In / RBAC Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

