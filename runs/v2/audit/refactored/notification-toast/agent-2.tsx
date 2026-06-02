import React, { useState } from "react";

/**
 * NotificationToast
 *
 * A polished success toast for the "Aperture" web app.
 * - Elevated surface with a soft, layered shadow
 * - Horizontal layout: success dot/badge, text block, ghost "Undo" button
 * - Fully self-contained, styled with inline style objects
 */

type NotificationToastProps = {
  title?: string;
  body?: string;
  onUndo?: () => void;
};

export default function NotificationToast({
  title = "Saved",
  body = "Your changes were published.",
  onUndo,
}: NotificationToastProps): JSX.Element {
  const [undoHover, setUndoHover] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  const [undoFocus, setUndoFocus] = useState(false);

  const COLORS = {
    surface: "#FFFFFF",
    border: "rgba(16, 24, 40, 0.08)",
    titleText: "#101828",
    bodyText: "#667085",
    success: "#12B76A",
    successRingOuter: "rgba(18, 183, 106, 0.16)",
    successRingInner: "rgba(18, 183, 106, 0.28)",
    undoText: "#344054",
    undoTextHover: "#101828",
    undoBgHover: "rgba(16, 24, 40, 0.05)",
    undoBgActive: "rgba(16, 24, 40, 0.09)",
    undoFocusRing: "rgba(18, 183, 106, 0.35)",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box",
    padding: "14px 16px",
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    boxShadow:
      "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -6px rgba(16, 24, 40, 0.12), 0 18px 40px -12px rgba(16, 24, 40, 0.10)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const badgeStyle: React.CSSProperties = {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: COLORS.successRingOuter,
    boxShadow: `0 0 0 4px ${COLORS.successRingOuter}`,
  };

  const dotStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: COLORS.success,
    boxShadow: "0 2px 5px rgba(18, 183, 106, 0.45)",
  };

  const textBlockStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: COLORS.titleText,
  };

  const bodyStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    lineHeight: "18px",
    fontWeight: 400,
    color: COLORS.bodyText,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const undoButtonStyle: React.CSSProperties = {
    flex: "0 0 auto",
    appearance: "none",
    WebkitAppearance: "none",
    border: "none",
    outline: "none",
    cursor: "pointer",
    padding: "7px 14px",
    borderRadius: 9,
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "-0.005em",
    color: undoHover ? COLORS.undoTextHover : COLORS.undoText,
    background: undoActive
      ? COLORS.undoBgActive
      : undoHover
      ? COLORS.undoBgHover
      : "transparent",
    boxShadow: undoFocus ? `0 0 0 3px ${COLORS.undoFocusRing}` : "none",
    transform: undoActive ? "translateY(0.5px)" : "translateY(0)",
    transition:
      "background-color 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 90ms ease",
  };

  return (
    <div role="status" aria-live="polite" style={containerStyle}>
      <span style={badgeStyle} aria-hidden="true">
        <span style={dotStyle}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12.5L10 17.5L19 7"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      <div style={textBlockStyle}>
        <p style={titleStyle}>{title}</p>
        <p style={bodyStyle}>{body}</p>
      </div>

      <button
        type="button"
        style={undoButtonStyle}
        onClick={onUndo}
        onMouseEnter={() => setUndoHover(true)}
        onMouseLeave={() => {
          setUndoHover(false);
          setUndoActive(false);
        }}
        onMouseDown={() => setUndoActive(true)}
        onMouseUp={() => setUndoActive(false)}
        onFocus={() => setUndoFocus(true)}
        onBlur={() => setUndoFocus(false)}
      >
        Undo
      </button>
    </div>
  );
}
