import React, { useState } from "react";

/**
 * PricingCard — "Pro" tier pricing card for the Aperture web app.
 *
 * An elevated surface featuring a "Most popular" status pill, the tier name,
 * a one-line description, a large price with a "/mo" caption, three feature
 * lines, and a full-width primary call-to-action.
 */

const features: string[] = [
  "Unlimited projects & exports",
  "Advanced color grading tools",
  "Priority support, under 4h",
];

const CheckIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block" }}
  >
    <circle cx="10" cy="10" r="10" fill="#EEF2FF" />
    <path
      d="M5.75 10.25l2.6 2.6 5.4-5.6"
      stroke="#4F46E5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PricingCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 380,
        margin: "0 auto",
        padding: 32,
        borderRadius: 24,
        background: "#FFFFFF",
        border: "1px solid rgba(79, 70, 229, 0.14)",
        boxShadow:
          "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 28px -8px rgba(16, 24, 40, 0.14), 0 28px 56px -20px rgba(79, 70, 229, 0.22)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#0F172A",
        position: "relative",
      }}
    >
      {/* Status pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 999,
          background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          boxShadow: "0 4px 12px -2px rgba(79, 70, 229, 0.45)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#FFFFFF",
            opacity: 0.9,
          }}
        />
        Most popular
      </div>

      {/* Tier name */}
      <h2
        style={{
          margin: "20px 0 0",
          fontSize: 24,
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0F172A",
        }}
      >
        Pro
      </h2>

      {/* Description */}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 15,
          lineHeight: 1.5,
          color: "#64748B",
        }}
      >
        For creators who ship daily and need pro-grade tools.
      </p>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginTop: 24,
        }}
      >
        <span
          style={{
            fontSize: 52,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0F172A",
          }}
        >
          $29
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#94A3B8",
          }}
        >
          /mo
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          width: "100%",
          margin: "24px 0",
          background:
            "linear-gradient(90deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.08) 50%, rgba(15,23,42,0) 100%)",
        }}
      />

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 15,
              lineHeight: 1.4,
              color: "#334155",
            }}
          >
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          appearance: "none",
          cursor: "pointer",
          width: "100%",
          marginTop: 28,
          padding: "15px 24px",
          borderRadius: 14,
          border: "none",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#FFFFFF",
          fontFamily: "inherit",
          background: hovered
            ? "linear-gradient(135deg, #5B57F0 0%, #463FD6 100%)"
            : "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          boxShadow: pressed
            ? "0 1px 2px rgba(79, 70, 229, 0.3)"
            : hovered
            ? "0 10px 24px -6px rgba(79, 70, 229, 0.55)"
            : "0 6px 16px -6px rgba(79, 70, 229, 0.5)",
          transform: pressed
            ? "translateY(1px) scale(0.995)"
            : hovered
            ? "translateY(-1px)"
            : "translateY(0)",
          transition:
            "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
        }}
      >
        Choose Pro
      </button>
    </div>
  );
};

export default PricingCard;
