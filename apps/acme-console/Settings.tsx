// Acme Console — Settings screen. Hand-rolled, no design system (dev B — different
// greys, paddings, radii, button style than Dashboard: organic drift).
import React from 'react';

export function Settings() {
  return (
    <div style={{ padding: '32px', background: '#f7f8fa' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#222630', marginBottom: '20px' }}>Settings</h2>
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e4e6eb', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#23272f' }}>Push notifications</div>
            <div style={{ fontSize: '13px', color: '#737b89' }}>Get notified about activity</div>
          </div>
          <div style={{ width: '44px', height: '26px', borderRadius: '999px', background: '#2f6df6' }} />
        </div>
        <div style={{ height: '1px', background: '#eceef1', margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#23272f' }}>Two-factor auth</div>
          <button style={{ background: '#eef1f5', color: '#2b2f38', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '14px' }}>Enable</button>
        </div>
      </div>
    </div>
  );
}
