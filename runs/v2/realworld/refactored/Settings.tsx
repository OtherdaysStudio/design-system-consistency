import { token } from '@/ds';
// Acme Console — Settings screen. Hand-rolled, no design system (dev B — different
// greys, paddings, radii, button style than Dashboard: organic drift).
import React from 'react';
export function Settings() {
  return <div style={{
    padding: token.space.xl,
    background: token.neutral["50"]
  }}>
      <h2 style={{
      fontSize: '24px',
      fontWeight: 600,
      color: token.neutral["900"],
      marginBottom: '20px'
    }}>Settings</h2>
      <div style={{
      background: token.neutral["0"],
      borderRadius: token.radius.sm,
      border: '1px solid #e4e6eb',
      padding: '20px'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0'
      }}>
          <div>
            <div style={{
            fontSize: token.fontSize.sm,
            fontWeight: 500,
            color: token.neutral["900"]
          }}>Push notifications</div>
            <div style={{
            fontSize: token.fontSize.xs,
            color: token.neutral["500"]
          }}>Get notified about activity</div>
          </div>
          <div style={{
          width: '44px',
          height: '26px',
          borderRadius: token.radius.pill,
          background: token.blue["500"]
        }} />
        </div>
        <div style={{
        height: '1px',
        background: token.neutral["100"],
        margin: '8px 0'
      }} />
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0'
      }}>
          <div style={{
          fontSize: token.fontSize.sm,
          fontWeight: 500,
          color: token.neutral["900"]
        }}>Two-factor auth</div>
          <button style={{
          background: token.neutral["100"],
          color: token.neutral["900"],
          border: 'none',
          borderRadius: token.radius.sm,
          padding: '8px 14px',
          fontSize: token.fontSize.sm
        }}>Enable</button>
        </div>
      </div>
    </div>;
}