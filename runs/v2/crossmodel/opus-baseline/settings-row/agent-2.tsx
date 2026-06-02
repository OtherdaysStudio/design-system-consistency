import React, { useState } from "react";

export default function SettingsRow() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "18px 20px",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        border: "1px solid #ececef",
        boxShadow:
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        maxWidth: 440,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: "20px",
            color: "#1a1a1f",
            letterSpacing: "-0.01em",
          }}
        >
          Push notifications
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 13,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#8a8a93",
          }}
        >
          Get notified about activity
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Push notifications"
        onClick={() => setEnabled((v) => !v)}
        style={{
          position: "relative",
          flexShrink: 0,
          width: 46,
          height: 28,
          padding: 0,
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          backgroundColor: enabled ? "#4f46e5" : "#d8d8de",
          transition: "background-color 200ms ease",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: enabled ? 21 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 1px 2px rgba(16, 24, 40, 0.2), 0 1px 3px rgba(16, 24, 40, 0.1)",
            transition: "left 200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          }}
        />
      </button>
    </div>
  );
}

export { SettingsRow };
