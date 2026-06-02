import React, { useState } from "react";

export default function ProfileHeader(): JSX.Element {
  const [following, setFollowing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const name = "Jordan Avery";
  const role = "Product Designer";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        maxWidth: 480,
        boxSizing: "border-box",
        background: "#ffffff",
        border: "1px solid #ececef",
        borderRadius: 16,
        boxShadow:
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 52,
          height: 52,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 0.2,
          userSelect: "none",
          boxShadow:
            "0 2px 6px rgba(99, 102, 241, 0.28), inset 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      >
        {initials}
      </div>

      {/* Name + role + badge */}
      <div
        style={{
          flex: "1 1 auto",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "#101828",
            letterSpacing: -0.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 400,
              lineHeight: 1.3,
              color: "#667085",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {role}
          </span>

          <span
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              padding: "1px 8px",
              fontSize: 11,
              fontWeight: 600,
              lineHeight: "16px",
              letterSpacing: 0.3,
              color: "#475467",
              background: "#f2f4f7",
              border: "1px solid #e4e7ec",
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            Pro
          </span>
        </div>
      </div>

      {/* Follow button */}
      <button
        type="button"
        onClick={() => setFollowing((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-pressed={following}
        style={{
          flexShrink: 0,
          appearance: "none",
          WebkitAppearance: "none",
          border: following ? "1px solid #d0d5dd" : "1px solid transparent",
          outline: "none",
          cursor: "pointer",
          padding: "8px 18px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: 0.1,
          borderRadius: 10,
          color: following ? "#344054" : "#ffffff",
          background: following
            ? hovered
              ? "#f9fafb"
              : "#ffffff"
            : hovered
            ? "#4f46e5"
            : "#6366f1",
          boxShadow: following
            ? "0 1px 2px rgba(16, 24, 40, 0.05)"
            : "0 1px 2px rgba(16, 24, 40, 0.05), 0 2px 6px rgba(99, 102, 241, 0.28)",
          transition:
            "background-color 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
          whiteSpace: "nowrap",
        }}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
