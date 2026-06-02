import React, { useState } from "react";

const CheckIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="11" fill="rgba(99, 102, 241, 0.12)" />
    <path
      d="M7.5 12.25 10.5 15.25 16.5 8.75"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const features: string[] = [
  "Unlimited projects & exports",
  "Advanced editing tools",
  "Priority support, 24/7",
];

export function PricingCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "48px 24px",
        background:
          "radial-gradient(120% 120% at 50% 0%, #f5f4ff 0%, #eef0fb 45%, #e6e9f5 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <article
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
          borderRadius: 24,
          padding: "40px 32px 32px",
          border: "1px solid rgba(99, 102, 241, 0.16)",
          boxShadow: hovered
            ? "0 32px 64px -24px rgba(49, 46, 129, 0.42), 0 12px 24px -12px rgba(49, 46, 129, 0.22), 0 0 0 1px rgba(99, 102, 241, 0.08)"
            : "0 24px 48px -20px rgba(49, 46, 129, 0.32), 0 8px 16px -8px rgba(49, 46, 129, 0.16)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition:
            "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          boxSizing: "border-box",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Most popular pill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            boxShadow: "0 8px 20px -6px rgba(99, 102, 241, 0.6)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.35)",
            }}
          />
          Most popular
        </div>

        {/* Tier name */}
        <h2
          style={{
            margin: "8px 0 0",
            fontSize: 22,
            fontWeight: 700,
            color: "#1e1b4b",
            letterSpacing: "-0.01em",
          }}
        >
          Pro
        </h2>

        {/* Description */}
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "#6b7280",
          }}
        >
          Everything you need to ship faster and scale with confidence.
        </p>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            margin: "24px 0 0",
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#1e1b4b",
            }}
          >
            $29
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#9ca3af",
            }}
          >
            /mo
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)",
            margin: "28px 0",
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
                fontSize: 14.5,
                color: "#374151",
              }}
            >
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          style={{
            marginTop: 32,
            width: "100%",
            padding: "15px 24px",
            border: "none",
            borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.01em",
            cursor: "pointer",
            boxShadow: hovered
              ? "0 16px 32px -10px rgba(99, 102, 241, 0.7)"
              : "0 10px 24px -10px rgba(99, 102, 241, 0.5)",
            transform: hovered ? "translateY(-1px)" : "translateY(0)",
            transition:
              "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
            fontFamily: "inherit",
          }}
        >
          Get started with Pro
        </button>
      </article>
    </div>
  );
}

export default PricingCard;
