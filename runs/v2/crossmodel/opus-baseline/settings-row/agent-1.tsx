import { useState } from "react";

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
        borderRadius: 14,
        border: "1px solid #ececef",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
        maxWidth: 480,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#16181d",
            letterSpacing: "-0.01em",
          }}
        >
          Push notifications
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.4,
            color: "#6b7280",
          }}
        >
          Get notified about activity
        </span>
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
          backgroundColor: enabled ? "#4f46e5" : "#d1d5db",
          transition: "background-color 0.2s ease",
          WebkitTapHighlightColor: "transparent",
          outline: "none",
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
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.25)",
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </button>
    </div>
  );
}

export { SettingsRow };
