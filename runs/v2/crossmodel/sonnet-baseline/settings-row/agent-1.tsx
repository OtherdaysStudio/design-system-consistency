import React, { useState } from "react";

const SettingsRow: React.FC = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        minWidth: "320px",
        maxWidth: "480px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          flex: 1,
          marginRight: "16px",
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#111827",
            lineHeight: "1.4",
            letterSpacing: "-0.01em",
          }}
        >
          Push notifications
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#6b7280",
            lineHeight: "1.4",
          }}
        >
          Get notified about activity
        </span>
      </div>

      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((prev) => !prev)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          width: "44px",
          height: "26px",
          borderRadius: "13px",
          border: "none",
          cursor: "pointer",
          padding: "0",
          flexShrink: 0,
          backgroundColor: enabled ? "#2563eb" : "#d1d5db",
          transition: "background-color 200ms ease",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: enabled ? "21px" : "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)",
            transition: "left 200ms ease",
          }}
        />
      </button>
    </div>
  );
};

export default SettingsRow;
