import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DepartmentGrid from './components/DepartmentGrid';
import DoctorCard from './components/DoctorCard';
import BookingModal from './components/BookingModal';
import SymptomMatcherWidget from './components/SymptomMatcherWidget';
import PatientPortal from './components/PatientPortal';
import AdminDashboard from './components/AdminDashboard';
import PreviousRecords from './components/PreviousRecords';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize JWT Token from LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('medicare_token');
    const storedUser = localStorage.getItem('medicare_user');
    
    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    setIsAuthChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const fetchData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        axios.get(`/api/doctors?specialization=${encodeURIComponent(selectedSpec)}&search=${encodeURIComponent(searchQuery)}`),
        axios.get('/api/doctors/specializations')
      ]);
      setDoctors(docRes.data);
      setSpecializations(specRes.data);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [selectedSpec, searchQuery, currentUser]);

  if (isAuthChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#38bdf8' }}>
        Verifying MediCare Authentication State...
      </div>
    );
  }

  // MANDATORY LOGIN GATE: Block entire UI if user is not authenticated
  if (!currentUser) {
    return (
      <LoginModal 
        isMandatory={true}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Glass Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onOpenLogin={() => {}}
        onLogout={handleLogout}
      />

      {/* Main Container Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            <HeroSection 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSpec={selectedSpec}
              setSelectedSpec={setSelectedSpec}
              onOpenSymptomMatcher={() => setActiveTab('symptom-matcher')}
            />

            <DepartmentGrid 
              specializations={specializations}
              selectedSpec={selectedSpec}
              setSelectedSpec={setSelectedSpec}
            />

            {/* Doctors Grid Section */}
            <div style={{ margin: '0 20px 40px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem' }}>Available OPD Doctors</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Showing {doctors.length} verified medical specialists
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading doctor directory...
                </div>
              ) : doctors.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <h3>No Doctors Found</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Try resetting your search query or department filter.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {doctors.map((doctor) => (
                    <DoctorCard 
                      key={doctor.id} 
                      doctor={doctor} 
                      onBookSlot={(doc) => setBookingDoctor(doc)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'symptom-matcher' && (
          <SymptomMatcherWidget 
            onBookDoctor={(doc) => setBookingDoctor(doc)} 
          />
        )}

        {activeTab === 'my-appointments' && (
          <PatientPortal 
            onNavigateToBook={() => setActiveTab('home')} 
          />
        )}

        {activeTab === 'medical-records' && (
          <PreviousRecords />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard 
            currentUser={currentUser}
            onPromptLogin={() => {}}
          />
        )}
      </main>

      {/* Booking Modal Overlay */}
      {bookingDoctor && (
        <BookingModal 
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={() => {
            fetchData();
          }}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
