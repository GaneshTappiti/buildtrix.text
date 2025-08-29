/**
 * Debug App Component
 * Minimal app to test if basic React rendering works
 */

import React from 'react';

const DebugApp: React.FC = () => {
  console.log('🧪 DebugApp rendering...');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      zIndex: 9999
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>🧪 Debug Mode</h1>
        <p>React is working! This is a minimal test component.</p>
        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
          <h3>Environment Check:</h3>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>MODE: {process.env.NODE_ENV}</p>
          <p>PROD: {String(process.env.NODE_ENV === 'production')}</p>
          <p>DEV: {String(process.env.NODE_ENV === 'development')}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
        <button 
          onClick={() => {
            console.log('🔄 Switching to full app...');
            window.location.hash = '#full-app';
            window.location.reload();
          }}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'white',
            color: '#059669',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Load Full App
        </button>
      </div>
    </div>
  );
};

export default DebugApp;
