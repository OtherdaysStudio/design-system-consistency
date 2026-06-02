// Acme Console — Dashboard screen. Hand-rolled, no design system (as built by dev A).
import React from 'react';

export function Dashboard() {
  return (
    <div style={{ padding: '24px', background: '#fbfbfc', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1d23', marginBottom: '18px' }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: '14px' }}>
        <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e8e8ed', padding: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', flex: 1 }}>
          <div style={{ fontSize: '13px', color: '#6e7682' }}>Revenue</div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#16181d' }}>$48.2k</div>
          <span style={{ background: '#e7f7ee', color: '#1c9c5d', borderRadius: '999px', padding: '3px 9px', fontSize: '12px' }}>+12.5%</span>
        </div>
        <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e8e8ed', padding: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', flex: 1 }}>
          <div style={{ fontSize: '13px', color: '#6e7682' }}>Active users</div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#16181d' }}>1,284</div>
        </div>
      </div>
      <button style={{ marginTop: '20px', background: '#2f6df6', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 18px', fontSize: '15px', fontWeight: 600 }}>
        View report
      </button>
    </div>
  );
}
