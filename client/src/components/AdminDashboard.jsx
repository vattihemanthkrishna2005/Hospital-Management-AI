import React, { useState } from 'react';
import { ShieldCheck, LayoutDashboard, Calendar, Users, ClipboardList } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import AdminAppointments from './admin/AdminAppointments';
import AdminDoctors from './admin/AdminDoctors';
import AdminRecords from './admin/AdminRecords';

const AdminDashboard = ({ currentUser, onPromptLogin }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e', backgroundColor: '#0b0f19', minHeight: '100vh' }}>
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
        <button onClick={onPromptLogin} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Login as Admin</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'records', label: 'Records', icon: ClipboardList }
  ];

  return (
    <div style={{ backgroundColor: '#0b0f19', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={28} color="#38bdf8" />
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', letterSpacing: '1px' }}>HOSPITAL MANAGEMENT CONTROL PANEL</h1>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Tabs */}
        <aside style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #334155', padding: '24px 0' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px 24px',
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  border: 'none', borderRight: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                  cursor: 'pointer', textAlign: 'left', fontSize: '1rem', transition: 'all 0.2s'
                }}
              >
                <Icon size={20} /> {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'appointments' && <AdminAppointments />}
          {activeTab === 'doctors' && <AdminDoctors />}
          {activeTab === 'records' && <AdminRecords />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
