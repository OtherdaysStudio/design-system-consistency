import { token } from '@/ds';
// Acme Console — Billing screen. Hand-rolled, no design system (dev C — yet another
// set of greys, radii, paddings, and a third button treatment).
import React from 'react';
export function Billing() {
  return <div style={{
    padding: '28px',
    background: token.neutral["0"]
  }}>
      <h1 style={{
      fontSize: token.fontSize.xl,
      fontWeight: 700,
      color: token.neutral["900"],
      marginBottom: token.space.md
    }}>Billing</h1>
      <div style={{
      background: token.neutral["0"],
      borderRadius: token.radius.md,
      border: '1px solid #ededf0',
      padding: token.space.lg,
      boxShadow: '0 2px 6px rgba(15,17,21,0.06)'
    }}>
        <div style={{
        fontSize: token.fontSize.sm,
        color: token.neutral["500"]
      }}>Current plan</div>
        <div style={{
        fontSize: token.fontSize.lg,
        fontWeight: 600,
        color: token.neutral["900"],
        marginTop: token.space.none
      }}>Pro — $29/mo</div>
        <span style={{
        background: token.amber["100"],
        color: token.amber["500"],
        borderRadius: token.radius.sm,
        padding: '4px 8px',
        fontSize: token.fontSize.xs,
        marginTop: token.space.sm,
        display: 'inline-block'
      }}>Renews Jun 30</span>
        <div style={{
        marginTop: token.space.md,
        display: 'flex',
        gap: token.space.sm
      }}>
          <button style={{
          background: token.blue["500"],
          color: token.neutral["0"],
          border: 'none',
          borderRadius: token.radius.sm,
          padding: '10px 16px',
          fontSize: token.fontSize.sm,
          fontWeight: 600
        }}>Upgrade</button>
          <button style={{
          background: 'transparent',
          color: token.neutral["700"],
          border: '1px solid #d4d4d8',
          borderRadius: token.radius.sm,
          padding: '10px 16px',
          fontSize: token.fontSize.sm
        }}>Cancel</button>
        </div>
      </div>
    </div>;
}