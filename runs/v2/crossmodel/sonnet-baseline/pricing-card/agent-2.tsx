import React from "react";

export const PricingCard: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: "20px",
        padding: "36px 32px",
        width: "320px",
        boxShadow:
          "0 20px 60px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      {/* Status pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          borderRadius: "100px",
          padding: "5px 14px",
          marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(99, 102, 241, 0.4)",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#ffffff",
            opacity: 0.9,
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          Most Popular
        </span>
      </div>

      {/* Tier name */}
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#f8fafc",
          margin: "0 0 8px 0",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        Pro
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "rgba(248, 250, 252, 0.6)",
          margin: "0 0 28px 0",
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        Everything you need to capture and share your best work.
      </p>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          marginBottom: "32px",
        }}
      >
        <span
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          $29
        </span>
        <span
          style={{
            fontSize: "15px",
            color: "rgba(248, 250, 252, 0.5)",
            fontWeight: 400,
            marginBottom: "6px",
          }}
        >
          /mo
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255, 255, 255, 0.08)",
          marginBottom: "24px",
        }}
      />

      {/* Feature lines */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 32px 0",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {[
          "Unlimited high-res exports",
          "Advanced RAW processing & editing",
          "Priority cloud sync & 500 GB storage",
        ].map((feature, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              color: "rgba(248, 250, 252, 0.85)",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#a5b4fc"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        style={{
          width: "100%",
          padding: "15px 24px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          border: "none",
          borderRadius: "12px",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.01em",
          boxShadow:
            "0 4px 20px rgba(99, 102, 241, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          transition: "all 0.2s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 28px rgba(99, 102, 241, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 20px rgba(99, 102, 241, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }}
      >
        Get Started with Pro
      </button>
    </div>
  );
};

export default PricingCard;
