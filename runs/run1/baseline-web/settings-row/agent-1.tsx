import React, { useState } from "react";

/**
 * SettingsRow
 *
 * A single settings list row with a label, a secondary helper line, and a
 * right-aligned toggle switch. Horizontal layout on a card-like surface.
 */
export default function SettingsRow(): React.ReactElement {
  const [enabled, setEnabled] = useState<boolean>(true);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        boxSizing: "border-box",
        background: "#f4f5f7",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        role="group"
        aria-label="Push notifications setting"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          width: "100%",
          maxWidth: 440,
          padding: "18px 20px",
          boxSizing: "border-box",
          background: "#ffffff",
          borderRadius: 14,
          border: "1px solid #ececef",
          boxShadow:
            "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        }}
      >
        {/* Label block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 15,
              lineHeight: "20px",
              fontWeight: 600,
              color: "#1a1d21",
              letterSpacing: "-0.01em",
            }}
          >
            Push notifications
          </span>
          <span
            style={{
              fontSize: 13,
              lineHeight: "18px",
              fontWeight: 400,
              color: "#6b7280",
            }}
          >
            Get notified about activity
          </span>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Push notifications"
          onClick={() => setEnabled((v) => !v)}
          style={{
            position: "relative",
            flexShrink: 0,
            width: 44,
            height: 26,
            padding: 0,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            background: enabled ? "#2f6bff" : "#d4d7dd",
            boxShadow: enabled
              ? "inset 0 0 0 1px rgba(0, 0, 0, 0.04)"
              : "inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
            transition: "background-color 180ms ease",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 3,
              left: enabled ? 21 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow:
                "0 1px 2px rgba(16, 24, 40, 0.2), 0 1px 1px rgba(16, 24, 40, 0.12)",
              transition: "left 180ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
