import { token } from '@/ds';
// Acme Console — Dashboard screen. Hand-rolled, no design system (as built by dev A).
import React from 'react';
export function Dashboard() {
  return <div style={{
    padding: token.space.lg,
    background: token.neutral["0"],
    minHeight: '100vh'
  }}>
      <h1 style={{
      fontSize: token.fontSize.xl,
      fontWeight: 700,
      color: token.neutral["900"],
      marginBottom: token.space.md
    }}>Dashboard</h1>
      <div style={{
      display: 'flex',
      gap: token.space.md
    }}>
        <div style={{
        background: token.neutral["0"],
        borderRadius: token.radius.md,
        border: '1px solid #e8e8ed',
        padding: token.space.md,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        flex: 1
      }}>
          <div style={{
          fontSize: token.fontSize.xs,
          color: token.neutral["500"]
        }}>Revenue</div>
          <div style={{
          fontSize: token.fontSize.xl,
          fontWeight: 700,
          color: token.neutral["900"]
        }}>$48.2k</div>
          <span style={{
          background: token.green["100"],
          color: token.green["500"],
          borderRadius: token.radius.pill,
          padding: '3px 9px',
          fontSize: token.fontSize.xs
        }}>+12.5%</span>
        </div>
        <div style={{
        background: token.neutral["0"],
        borderRadius: token.radius.md,
        border: '1px solid #e8e8ed',
        padding: token.space.md,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        flex: 1
      }}>
          <div style={{
          fontSize: token.fontSize.xs,
          color: token.neutral["500"]
        }}>Active users</div>
          <div style={{
          fontSize: token.fontSize.xl,
          fontWeight: 700,
          color: token.neutral["900"]
        }}>1,284</div>
        </div>
      </div>
      <button style={{
      marginTop: '20px',
      background: token.blue["500"],
      color: token.neutral["0"],
      border: 'none',
      borderRadius: token.radius.md,
      padding: '11px 18px',
      fontSize: token.fontSize.sm,
      fontWeight: 600
    }}>
        View report
      </button>
    </div>;
}