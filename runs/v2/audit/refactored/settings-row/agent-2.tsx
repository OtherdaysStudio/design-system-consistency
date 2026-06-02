import { token } from '@/ds';
import React, { useState } from "react";
export default function SettingsRow(): React.JSX.Element {
  const [enabled, setEnabled] = useState<boolean>(true);
  return <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: token.space.md,
    width: "100%",
    maxWidth: 480,
    boxSizing: "border-box",
    padding: "18px 20px",
    backgroundColor: token.neutral["0"],
    border: "1px solid #ECECEF",
    borderRadius: token.radius.lg,
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 1px rgba(16, 24, 40, 0.02)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  }}>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: token.space.xs,
      minWidth: 0
    }}>
        <span style={{
        fontSize: token.fontSize.sm,
        fontWeight: 600,
        lineHeight: 1.3,
        color: token.neutral["900"],
        letterSpacing: "-0.01em"
      }}>
          Push notifications
        </span>
        <span style={{
        fontSize: token.fontSize.xs,
        fontWeight: 400,
        lineHeight: 1.4,
        color: token.neutral["500"],
        letterSpacing: "-0.005em"
      }}>
          Get notified about activity
        </span>
      </div>

      <button type="button" role="switch" aria-checked={enabled} aria-label="Push notifications" onClick={() => setEnabled(prev => !prev)} style={{
      position: "relative",
      flexShrink: 0,
      width: 44,
      height: 26,
      padding: 0,
      border: "none",
      borderRadius: token.radius.pill,
      cursor: "pointer",
      backgroundColor: enabled ? "#2F6BFF" : "#D4D4D8",
      transition: "background-color 0.22s ease",
      outline: "none",
      WebkitTapHighlightColor: "transparent"
    }}>
        <span aria-hidden="true" style={{
        position: "absolute",
        top: 3,
        left: 3,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: token.neutral["0"],
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.18), 0 1px 3px rgba(16, 24, 40, 0.10)",
        transform: enabled ? "translateX(18px)" : "translateX(0)",
        transition: "transform 0.22s cubic-bezier(0.4, 0.0, 0.2, 1)"
      }} />
      </button>
    </div>;
}