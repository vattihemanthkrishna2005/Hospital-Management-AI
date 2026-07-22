import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RefreshCw } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#f59e0b';
      case 'Checked-in': return '#3b82f6';
      case 'In Consultation': return '#a855f7';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#f43f5e';
      default: return '#94a3b8';
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      (a.patientName && a.patientName.toLowerCase().includes(term)) ||
      (a.referenceCode && a.referenceCode.toLowerCase().includes(term)) ||
      (a.doctorName && a.doctorName.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }}>Appointment Queue</h2>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '8px 12px 8px 36px', 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '6px',
                color: '#fff',
                outline: 'none',
                width: '250px'
              }}
            />
          </div>
          <button 
            onClick={fetchAppointments}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', backgroundColor: '#334155', 
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' 
            }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '500' }}>REF CODE</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '500' }}>PATIENT</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '500' }}>DOCTOR</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '500' }}>DATE & TIME</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '500' }}>STATUS CONTROL</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
            ) : filteredAppointments.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No appointments found</td></tr>
            ) : (
              filteredAppointments.map(appt => (
                <tr key={appt._id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '16px', color: '#cbd5e1' }}>{appt.referenceCode || 'N/A'}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ color: '#f8fafc' }}>{appt.patientName}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{appt.patientContact}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#cbd5e1' }}>{appt.doctorName}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ color: '#cbd5e1' }}>{new Date(appt.date).toLocaleDateString()}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{appt.time}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={appt.status || 'Scheduled'} 
                      onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#0f172a',
                        color: getStatusColor(appt.status || 'Scheduled'),
                        border: `1px solid ${getStatusColor(appt.status || 'Scheduled')}`,
                        borderRadius: '4px',
                        outline: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Checked-in">Checked-in</option>
                      <option value="In Consultation">In Consultation</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
