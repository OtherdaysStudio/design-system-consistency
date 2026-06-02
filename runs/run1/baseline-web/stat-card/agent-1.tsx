import React from "react";

/**
 * StatCard
 * A polished dashboard stat card showing a caption, a large display
 * number, and a success-toned trend badge — stacked vertically on a surface.
 */
export default function StatCard(): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
        width: 264,
        padding: "24px 24px 26px",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)",
        borderRadius: 18,
        border: "1px solid #ECECF0",
        boxShadow:
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -8px rgba(16, 24, 40, 0.08)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Caption label */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "16px",
          letterSpacing: "0.01em",
          color: "#6B7280",
          textTransform: "none",
        }}
      >
        Monthly revenue
      </span>

      {/* Display number + trend badge */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 700,
            lineHeight: "42px",
            letterSpacing: "-0.025em",
            color: "#111827",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          $48.2k
        </span>

        {/* Success-toned trend badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px 3px 7px",
            borderRadius: 999,
            background: "#ECFDF3",
            border: "1px solid #ABEFC6",
            color: "#067647",
            fontSize: 12.5,
            fontWeight: 600,
            lineHeight: "16px",
            letterSpacing: "0.005em",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            transform: "translateY(-2px)",
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <path
              d="M6 9.5V2.5M6 2.5L2.75 5.75M6 2.5L9.25 5.75"
              stroke="#17A862"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          12.5%
        </span>
      </div>
    </div>
  );
}
