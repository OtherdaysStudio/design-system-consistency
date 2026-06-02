import { token } from '@/ds';
import React from "react";

/**
 * StatCard — a dashboard statistic card.
 *
 * Renders a caption label, a large display number, and a success-toned
 * trend badge, stacked vertically on an elevated surface.
 */
export default function StatCard(): React.JSX.Element {
  return <div style={{
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: token.space.md,
    width: 280,
    padding: "24px 26px",
    boxSizing: "border-box",
    background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)",
    border: "1px solid #ECEDF1",
    borderRadius: token.radius.lg,
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  }}>
      {/* Caption label */}
      <span style={{
      fontSize: token.fontSize.xs,
      fontWeight: 600,
      lineHeight: "16px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: token.neutral["400"],
      margin: 0
    }}>
        Monthly revenue
      </span>

      {/* Display number */}
      <span style={{
      fontSize: 40,
      fontWeight: 700,
      lineHeight: "44px",
      letterSpacing: "-0.025em",
      color: token.neutral["900"],
      fontVariantNumeric: "tabular-nums",
      margin: 0
    }}>
        $48.2k
      </span>

      {/* Success-toned trend badge */}
      <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: token.space.xs,
      height: 26,
      padding: "0 10px",
      background: token.green["100"],
      border: "1px solid #C6EBD2",
      borderRadius: token.radius.pill,
      fontSize: token.fontSize.xs,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      color: "#177A3C",
      fontVariantNumeric: "tabular-nums"
    }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{
        display: "block"
      }}>
          <path d="M6 9.5V2.5M6 2.5L2.75 5.75M6 2.5L9.25 5.75" stroke="#1A9C4C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        +12.5%
      </span>
    </div>;
}