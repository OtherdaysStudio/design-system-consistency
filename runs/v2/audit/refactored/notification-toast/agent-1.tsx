import { token } from '@/ds';
import React, { useState } from "react";

/**
 * NotificationToast
 *
 * A polished success toast for the "Aperture" web app.
 * - Success badge/dot on the left
 * - Bold title ("Saved") + body line ("Your changes were published.")
 * - Ghost "Undo" action button on the right
 * - Elevated surface, horizontal layout
 */
export default function NotificationToast(): JSX.Element {
  const [undoHovered, setUndoHovered] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  return <div role="status" aria-live="polite" style={{
    display: "flex",
    alignItems: "center",
    gap: token.space.md,
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box",
    padding: "14px 16px",
    background: token.neutral["0"],
    borderRadius: token.radius.lg,
    border: "1px solid rgba(15, 23, 42, 0.06)",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.18), 0 18px 40px -16px rgba(15, 23, 42, 0.16)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  }}>
      {/* Success badge / dot */}
      <div aria-hidden="true" style={{
      flexShrink: 0,
      width: 36,
      height: 36,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.10) 100%)",
      boxShadow: "inset 0 0 0 1px rgba(16, 185, 129, 0.20)"
    }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Text block */}
      <div style={{
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: token.space.none
    }}>
        <span style={{
        fontSize: token.fontSize.sm,
        lineHeight: "20px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: token.neutral["900"]
      }}>
          Saved
        </span>
        <span style={{
        fontSize: token.fontSize.xs,
        lineHeight: "18px",
        fontWeight: 400,
        color: token.neutral["500"],
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}>
          Your changes were published.
        </span>
      </div>

      {/* Ghost Undo button */}
      <button type="button" onMouseEnter={() => setUndoHovered(true)} onMouseLeave={() => {
      setUndoHovered(false);
      setUndoActive(false);
    }} onMouseDown={() => setUndoActive(true)} onMouseUp={() => setUndoActive(false)} style={{
      flexShrink: 0,
      appearance: "none",
      WebkitAppearance: "none",
      border: "none",
      outline: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: token.fontSize.xs,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: undoHovered ? "#4338ca" : "#4f46e5",
      padding: "7px 12px",
      borderRadius: token.radius.md,
      background: undoActive ? "rgba(79, 70, 229, 0.14)" : undoHovered ? "rgba(79, 70, 229, 0.08)" : "transparent",
      transform: undoActive ? "scale(0.97)" : "scale(1)",
      transition: "background-color 140ms ease, color 140ms ease, transform 120ms ease"
    }}>
        Undo
      </button>
    </div>;
}