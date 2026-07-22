import React from 'react';
import { Activity, PhoneCall, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel" style={{ margin: '40px 20px 20px 20px', padding: '2.5rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Col 1 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Activity size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }} className="text-gradient">
              MediCare Hub
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Next-generation OPD hospital management & appointment booking system. Built for Azure Serverless architecture.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 style={{ marginBottom: '0.85rem', fontSize: '1rem' }}>Emergency Services</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PhoneCall size={14} color="var(--accent-cyan)" /> 24/7 Trauma: 1-800-MEDICARE
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} color="var(--accent-purple)" /> emergency@medicarehub.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="var(--accent-emerald)" /> Central Medicare Hub Tower, Ave 5
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 style={{ marginBottom: '0.85rem', fontSize: '1rem' }}>Azure Cloud Specs</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            • Azure Static Web Apps (Free Tier)<br/>
            • Azure Container Apps (minReplicas: 0)<br/>
            • Azure SQL Serverless (Auto-Pause)
          </p>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        © 2026 MediCare Hub System. Designed for Azure Student Account ($100 budget optimization). All rights reserved.
      </div>
    </footer>
  );
}
