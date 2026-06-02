// Acme Console — Billing screen. Hand-rolled, no design system (dev C — yet another
// set of greys, radii, paddings, and a third button treatment).
import React from 'react';

export function Billing() {
  return (
    <div style={{ padding: '28px', background: '#fcfcfd' }}>
      <h1 style={{ fontSize: '27px', fontWeight: 700, color: '#18181b', marginBottom: '16px' }}>Billing</h1>
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #ededf0', padding: '22px', boxShadow: '0 2px 6px rgba(15,17,21,0.06)' }}>
        <div style={{ fontSize: '14px', color: '#71717a' }}>Current plan</div>
        <div style={{ fontSize: '20px', fontWeight: 600, color: '#18181b', marginTop: '2px' }}>Pro — $29/mo</div>
        <span style={{ background: '#fff4e5', color: '#b06a00', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', marginTop: '10px', display: 'inline-block' }}>Renews Jun 30</span>
        <div style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
          <button style={{ background: '#3b6cf0', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 600 }}>Upgrade</button>
          <button style={{ background: 'transparent', color: '#52525b', border: '1px solid #d4d4d8', borderRadius: '8px', padding: '10px 16px', fontSize: '14px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
