import React, { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const [hovered, setHovered] = useState<"primary" | "ghost" | null>(null);

  const colors = {
    pageBg: "#f4f5f7",
    cardBg: "#ffffff",
    border: "#e3e6eb",
    borderFocus: "#4f46e5",
    text: "#1a1d23",
    subtext: "#6b7280",
    label: "#374151",
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    inputBg: "#ffffff",
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.pageBg,
    padding: "24px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: colors.cardBg,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    boxShadow:
      "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.08)",
    padding: "40px",
    boxSizing: "border-box",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "26px",
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: colors.text,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: "8px 0 0 0",
    fontSize: "15px",
    lineHeight: 1.5,
    color: colors.subtext,
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "32px",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: colors.label,
    letterSpacing: "0.01em",
  };

  const inputStyle = (field: "email" | "password"): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: "15px",
    color: colors.text,
    backgroundColor: colors.inputBg,
    border: `1px solid ${
      focused === field ? colors.borderFocus : colors.border
    }`,
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    boxShadow:
      focused === field ? `0 0 0 3px rgba(79, 70, 229, 0.15)` : "none",
  });

  const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 16px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor:
      hovered === "primary" ? colors.primaryHover : colors.primary,
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.15s ease, transform 0.05s ease",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)",
    marginTop: "8px",
  };

  const ghostButtonStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 16px",
    fontSize: "15px",
    fontWeight: 600,
    color: colors.text,
    backgroundColor: hovered === "ghost" ? "#f3f4f6" : "transparent",
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    marginTop: "10px",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Welcome back</h1>
        <p style={subtitleStyle}>
          Sign in to your Aperture account to continue.
        </p>

        <form style={formStyle} onSubmit={handleSubmit} noValidate>
          <div style={fieldStyle}>
            <label htmlFor="login-email" style={labelStyle}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={inputStyle("email")}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="login-password" style={labelStyle}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={inputStyle("password")}
            />
          </div>

          <button
            type="submit"
            style={primaryButtonStyle}
            onMouseEnter={() => setHovered("primary")}
            onMouseLeave={() => setHovered(null)}
          >
            Sign in
          </button>

          <button
            type="button"
            style={ghostButtonStyle}
            onMouseEnter={() => setHovered("ghost")}
            onMouseLeave={() => setHovered(null)}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
