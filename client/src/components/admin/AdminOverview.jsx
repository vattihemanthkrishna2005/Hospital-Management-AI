import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, CheckCircle, DollarSign } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedToday: 0,
    activeDoctors: 0,
    estimatedRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apptsRes, docsRes] = await Promise.all([
          axios.get('/api/appointments/all'),
          axios.get('/api/doctors')
        ]);
        
        const appointments = apptsRes.data;
        const doctors = docsRes.data;
        
        const today = new Date().toDateString();
        const completedToday = appointments.filter(a => 
          a.status === 'Completed' && new Date(a.date).toDateString() === today
        ).length;
        
        const revenue = appointments.reduce((acc, appt) => {
          if (appt.status === 'Completed' || appt.status === 'Scheduled') {
            const doc = doctors.find(d => d._id === appt.doctorId || d.id === appt.doctorId);
            return acc + (doc ? (doc.fee || 500) : 500);
          }
          return acc;
        }, 0);

        setStats({
          totalAppointments: appointments.length,
          completedToday,
          activeDoctors: doctors.length,
          estimatedRevenue: revenue
        });
      } catch (error) {
        console.error('Error fetching overview stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const iconStyle = {
    padding: '12px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    color: '#38bdf8'
  };

  return (
    <div style={{ color: '#ffffff' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#f8fafc' }}>Dashboard Overview</h2>
      
      {loading ? (
        <div style={{ color: '#94a3b8' }}>Loading stats...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          <div style={cardStyle}>
            <div style={iconStyle}><Calendar size={24} /></div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '4px' }}>Total Appointments</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalAppointments}</div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{...iconStyle, color: '#10b981'}}><CheckCircle size={24} /></div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '4px' }}>Completed Today</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completedToday}</div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{...iconStyle, color: '#a855f7'}}><Users size={24} /></div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '4px' }}>Active Doctors</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.activeDoctors}</div>
            </div>
          </div>
          
          <div style={cardStyle}>
            <div style={{...iconStyle, color: '#f59e0b'}}><DollarSign size={24} /></div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '4px' }}>Estimated Revenue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{stats.estimatedRevenue.toLocaleString()}</div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
