import React, { useState } from 'react';
import axios from 'axios';
import { Search, FileText } from 'lucide-react';

const AdminRecords = () => {
  const [email, setEmail] = useState('');
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`/api/records/patient/${email}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching records', err);
      setRecords([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#f8fafc' }}>Patient Records</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
          <input 
            type="email" 
            placeholder="Search by patient email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%',
              padding: '10px 12px 10px 36px', 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155', 
              borderRadius: '6px',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{ 
            padding: '10px 24px', backgroundColor: '#38bdf8', 
            color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Search Records
        </button>
      </form>

      {loading ? (
        <div style={{ color: '#94a3b8' }}>Searching records...</div>
      ) : searched && records.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', border: '1px dashed #334155', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
          <FileText size={48} style={{ color: '#334155', margin: '0 auto 16px auto' }} />
          <div style={{ color: '#94a3b8', fontSize: '1.125rem' }}>No records found for this email.</div>
        </div>
      ) : records.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {records.map(record => (
            <div key={record._id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc' }}>{record.doctorName || 'Doctor'}</h4>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{new Date(record.date).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h5 style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase' }}>Diagnosis</h5>
                  <p style={{ margin: 0, color: '#f8fafc', whiteSpace: 'pre-wrap' }}>{record.diagnosis || 'None provided'}</p>
                </div>
                <div>
                  <h5 style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase' }}>Prescription</h5>
                  <p style={{ margin: 0, color: '#f8fafc', whiteSpace: 'pre-wrap' }}>{record.prescription || 'None provided'}</p>
                </div>
              </div>
              
              {record.notes && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #334155' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase' }}>Additional Notes</h5>
                  <p style={{ margin: 0, color: '#94a3b8' }}>{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AdminRecords;
