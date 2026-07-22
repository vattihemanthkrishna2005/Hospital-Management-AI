import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="background:%231f2937;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization_name: 'Cardiology',
    experience: '',
    fee: '',
    avatar: '',
    available_days: 'Mon-Fri',
    available_hours: '09:00 AM - 05:00 PM'
  });

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/doctors', formData);
      setShowForm(false);
      setFormData({
        name: '',
        specialization_name: 'Cardiology',
        experience: '',
        fee: '',
        avatar: '',
        available_days: 'Mon-Fri',
        available_hours: '09:00 AM - 05:00 PM'
      });
      fetchDoctors();
    } catch (err) {
      console.error('Error adding doctor', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`/api/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error('Error deleting doctor', err);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }}>Doctor Directory</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 16px', backgroundColor: '#38bdf8', 
            color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add New Doctor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#f8fafc' }}>Add New Doctor</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img 
                src={formData.avatar || placeholderSvg} 
                alt="Preview" 
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #334155' }} 
              />
              <div style={{ width: '100%' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>Avatar URL (optional)</label>
                <input 
                  type="text" name="avatar" value={formData.avatar} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>Doctor Name *</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>Specialization</label>
                <select 
                  name="specialization_name" value={formData.specialization_name} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                >
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                  <option>General Medicine</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>Experience (years)</label>
                <input 
                  type="number" name="experience" value={formData.experience} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>Consultation Fee (₹)</label>
                <input 
                  type="number" name="fee" value={formData.fee} onChange={handleChange}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Doctor
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {doctors.map(doc => (
          <div key={doc._id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <button 
              onClick={() => handleDelete(doc._id)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={18} />
            </button>
            <img 
              src={doc.avatar || placeholderSvg} 
              alt={doc.name} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '2px solid #334155' }} 
            />
            <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc' }}>{doc.name}</h3>
            <div style={{ color: '#38bdf8', fontSize: '0.875rem', marginBottom: '12px' }}>{doc.specialization_name}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '16px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Exp: <span style={{ color: '#fff' }}>{doc.experience} yrs</span></div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Fee: <span style={{ color: '#fff' }}>₹{doc.fee}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDoctors;
