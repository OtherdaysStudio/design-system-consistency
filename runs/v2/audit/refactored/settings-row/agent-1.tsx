import { token } from '@/ds';
import React, { useState } from "react";

/**
 * SettingsRow
 *
 * A single settings list row with a label, a secondary helper line, and a
 * right-aligned toggle switch. Horizontal layout on a card-like surface.
 */
export default function SettingsRow(): React.ReactElement {
  const [enabled, setEnabled] = useState<boolean>(true);
  return <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: token.space.lg,
    boxSizing: "border-box",
    background: token.neutral["50"],
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  }}>
      <div role="group" aria-label="Push notifications setting" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: token.space.lg,
      width: "100%",
      maxWidth: 440,
      padding: "18px 20px",
      boxSizing: "border-box",
      background: token.neutral["0"],
      borderRadius: token.radius.lg,
      border: "1px solid #ececef",
      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)"
    }}>
        {/* Label block */}
        <div style={{
        display: "flex",
        flexDirection: "column",
        gap: token.space.xs,
        minWidth: 0
      }}>
          <span style={{
          fontSize: token.fontSize.sm,
          lineHeight: "20px",
          fontWeight: 600,
          color: token.neutral["900"],
          letterSpacing: "-0.01em"
        }}>
            Push notifications
          </span>
          <span style={{
          fontSize: token.fontSize.xs,
          lineHeight: "18px",
          fontWeight: 400,
          color: token.neutral["500"]
        }}>
            Get notified about activity
          </span>
        </div>

        {/* Toggle switch */}
        <button type="button" role="switch" aria-checked={enabled} aria-label="Push notifications" onClick={() => setEnabled(v => !v)} style={{
        position: "relative",
        flexShrink: 0,
        width: 44,
        height: 26,
        padding: 0,
        border: "none",
        borderRadius: token.radius.pill,
        cursor: "pointer",
        background: enabled ? "#2f6bff" : "#d4d7dd",
        boxShadow: enabled ? "inset 0 0 0 1px rgba(0, 0, 0, 0.04)" : "inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
        transition: "background-color 180ms ease",
        outline: "none",
        WebkitTapHighlightColor: "transparent"
      }}>
          <span aria-hidden="true" style={{
          position: "absolute",
          top: 3,
          left: enabled ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: token.neutral["0"],
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.2), 0 1px 1px rgba(16, 24, 40, 0.12)",
          transition: "left 180ms cubic-bezier(0.4, 0.0, 0.2, 1)"
        }} />
        </button>
      </div>
    </div>;
}