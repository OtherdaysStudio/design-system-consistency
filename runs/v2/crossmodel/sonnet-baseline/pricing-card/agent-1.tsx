import React from "react";

export const PricingCard: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: "20px",
        padding: "36px 32px 32px",
        width: "320px",
        boxShadow:
          "0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "180px",
          height: "180px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Status pill */}
      <div style={{ display: "flex" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: "20px",
            boxShadow: "0 2px 12px rgba(99, 102, 241, 0.45)",
          }}
        >
          <span style={{ fontSize: "8px" }}>★</span>
          Most Popular
        </span>
      </div>

      {/* Tier name + description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Pro
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.55)",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          Everything you need to shoot, edit, and share at a professional level.
        </p>
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "20px 0",
        }}
      >
        <span
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          $29
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "6px",
            fontWeight: 500,
          }}
        >
          /mo
        </span>
      </div>

      {/* Feature lines */}
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {[
          "Unlimited RAW exports & cloud storage",
          "AI-powered culling and auto-edit presets",
          "Advanced color grading with LUT support",
        ].map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: 450,
              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: "#818cf8",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        style={{
          width: "100%",
          padding: "15px 24px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          letterSpacing: "0.01em",
          boxShadow:
            "0 4px 20px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          marginTop: "4px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 8px 28px rgba(99, 102, 241, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 20px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }}
      >
        Get Started with Pro
      </button>
    </div>
  );
};

export default PricingCard;
