import React, { useState } from "react";

export function PricingCard() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const features = [
    "Unlimited high-resolution exports",
    "Advanced color grading & presets",
    "Priority support, replies within 4h",
  ];

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 360,
          background: "linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%)",
          border: "1px solid rgba(17, 24, 39, 0.06)",
          borderRadius: 24,
          padding: "36px 32px 32px",
          boxShadow:
            "0 1px 1px rgba(17, 24, 39, 0.03), 0 12px 24px -8px rgba(17, 24, 39, 0.12), 0 32px 64px -24px rgba(17, 24, 39, 0.18)",
          boxSizing: "border-box",
        }}
      >
        {/* Most popular pill */}
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.02em",
            borderRadius: 999,
            boxShadow: "0 6px 16px -4px rgba(99, 102, 241, 0.5)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.28)",
            }}
          />
          Most popular
        </div>

        {/* Tier name */}
        <h3
          style={{
            margin: "8px 0 0",
            fontSize: 20,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.01em",
          }}
        >
          Pro
        </h3>

        {/* Description */}
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            lineHeight: 1.5,
            color: "#6b7280",
          }}
        >
          Everything you need to shoot, edit, and ship like a studio.
        </p>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.03em",
              lineHeight: 1,
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
            margin: "24px 0",
            background:
              "linear-gradient(90deg, transparent, rgba(17,24,39,0.08) 20%, rgba(17,24,39,0.08) 80%, transparent)",
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
                alignItems: "flex-start",
                gap: 12,
                fontSize: 14.5,
                lineHeight: 1.45,
                color: "#374151",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flex: "0 0 auto",
                  marginTop: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 6.2L4.8 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {feature}
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
            marginTop: 28,
            width: "100%",
            padding: "14px 20px",
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            cursor: "pointer",
            transform: pressed
              ? "translateY(0) scale(0.99)"
              : hovered
              ? "translateY(-1px)"
              : "translateY(0)",
            boxShadow: hovered
              ? "0 10px 28px -6px rgba(99, 102, 241, 0.55)"
              : "0 6px 18px -6px rgba(99, 102, 241, 0.45)",
            transition:
              "transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease",
            filter: hovered ? "brightness(1.03)" : "brightness(1)",
          }}
        >
          Get started with Pro
        </button>
      </div>
    </div>
  );
}

export default PricingCard;
