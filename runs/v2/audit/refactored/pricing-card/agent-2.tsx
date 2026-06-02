import { token } from '@/ds';
import React, { useState } from "react";

/**
 * PricingCard — "Pro" tier
 * A self-contained, production-quality pricing card for the Aperture web app.
 * Styled entirely with inline style objects.
 */

const COLORS = {
  surface: "#FFFFFF",
  ink: "#0F1115",
  inkMuted: "#5B6472",
  inkFaint: "#8A93A2",
  border: "#EAECEF",
  accent: "#4F46E5",
  accentHover: "#4338CA",
  accentSoft: "#EEF0FF",
  accentInk: "#4F46E5",
  checkBg: "#EEF0FF",
  pillBg: "linear-gradient(135deg, #4F46E5 0%, #7C6BF0 100%)"
};
const FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const features: string[] = ["Unlimited projects & exports", "Advanced color grading tools", "Priority support, replies in 4h"];
function CheckIcon() {
  return <span aria-hidden="true" style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    width: 22,
    height: 22,
    borderRadius: token.radius.pill,
    backgroundColor: COLORS.checkBg,
    marginTop: token.space.none
  }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.25 6.3L4.65 8.7L9.75 3.6" stroke={COLORS.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>;
}
export default function PricingCard() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return <div style={{
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 20,
    padding: "32px 28px",
    fontFamily: FONT_STACK,
    color: COLORS.ink,
    boxShadow: "0 1px 2px rgba(15, 17, 21, 0.04), 0 12px 28px -8px rgba(15, 17, 21, 0.12), 0 30px 60px -20px rgba(79, 70, 229, 0.18)",
    position: "relative",
    textAlign: "left"
  }}>
      {/* Status pill */}
      <div style={{
      marginBottom: token.space.md
    }}>
        <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: token.space.xs,
        padding: "6px 12px",
        borderRadius: token.radius.pill,
        background: COLORS.pillBg,
        color: token.neutral["0"],
        fontSize: token.fontSize.xs,
        fontWeight: 600,
        letterSpacing: 0.3,
        lineHeight: 1,
        boxShadow: "0 4px 12px -2px rgba(79, 70, 229, 0.45)"
      }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#FFFFFF" />
          </svg>
          Most popular
        </span>
      </div>

      {/* Heading + description */}
      <h2 style={{
      margin: 0,
      fontSize: token.fontSize.lg,
      fontWeight: 700,
      letterSpacing: -0.4,
      lineHeight: 1.2,
      color: COLORS.ink
    }}>
        Pro
      </h2>
      <p style={{
      margin: "8px 0 0",
      fontSize: token.fontSize.sm,
      lineHeight: 1.5,
      color: COLORS.inkMuted
    }}>
        For creators who ship work every day.
      </p>

      {/* Price */}
      <div style={{
      display: "flex",
      alignItems: "baseline",
      gap: token.space.sm,
      marginTop: token.space.lg
    }}>
        <span style={{
        fontSize: 48,
        fontWeight: 800,
        letterSpacing: -1.5,
        lineHeight: 1,
        color: COLORS.ink
      }}>
          $29
        </span>
        <span style={{
        fontSize: token.fontSize.sm,
        fontWeight: 500,
        color: COLORS.inkFaint
      }}>
          /mo
        </span>
      </div>

      {/* Divider */}
      <div style={{
      height: 1,
      backgroundColor: COLORS.border,
      margin: "24px 0"
    }} />

      {/* Features */}
      <ul style={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: token.space.md
    }}>
        {features.map(feature => <li key={feature} style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        fontSize: token.fontSize.sm,
        lineHeight: 1.45,
        color: COLORS.ink
      }}>
            <CheckIcon />
            <span>{feature}</span>
          </li>)}
      </ul>

      {/* CTA */}
      <button type="button" onMouseEnter={() => setHovered(true)} onMouseLeave={() => {
      setHovered(false);
      setPressed(false);
    }} onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} style={{
      appearance: "none",
      WebkitAppearance: "none",
      boxSizing: "border-box",
      width: "100%",
      marginTop: 28,
      padding: "14px 20px",
      border: "none",
      borderRadius: token.radius.md,
      backgroundColor: hovered ? COLORS.accentHover : COLORS.accent,
      color: token.neutral["0"],
      fontFamily: FONT_STACK,
      fontSize: token.fontSize.sm,
      fontWeight: 600,
      letterSpacing: 0.1,
      cursor: "pointer",
      transition: "background-color 160ms ease, transform 120ms ease, box-shadow 160ms ease",
      transform: pressed ? "translateY(1px)" : "translateY(0)",
      boxShadow: hovered ? "0 10px 22px -6px rgba(79, 70, 229, 0.5)" : "0 6px 16px -6px rgba(79, 70, 229, 0.45)",
      outline: "none"
    }}>
        Choose Pro
      </button>
    </div>;
}