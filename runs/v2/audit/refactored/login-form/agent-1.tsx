import React, { useState } from "react";

/**
 * LoginForm — a polished, production-quality sign-in card for the Aperture web app.
 * Fully self-contained; every element is styled with inline style objects.
 */
export default function LoginForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [primaryActive, setPrimaryActive] = useState(false);
  const [ghostHover, setGhostHover] = useState(false);

  const colors = {
    bg: "#F4F5F7",
    card: "#FFFFFF",
    border: "#E3E6EB",
    borderFocus: "#6366F1",
    text: "#0F172A",
    subtitle: "#64748B",
    label: "#334155",
    placeholder: "#94A3B8",
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    primaryActive: "#3730A3",
    ghostText: "#4F46E5",
    ghostHoverBg: "#EEF0FF",
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(1200px 600px at 50% -10%, #ECEEFF 0%, ${colors.bg} 55%)`,
    padding: "24px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    background: colors.card,
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    boxShadow:
      "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.08)",
    padding: "40px 36px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "26px",
    lineHeight: "32px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: colors.text,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "15px",
    lineHeight: "22px",
    fontWeight: 400,
    color: colors.subtitle,
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: "16px",
    fontWeight: 600,
    color: colors.label,
    letterSpacing: "0.01em",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    height: "44px",
    padding: "0 14px",
    fontSize: "15px",
    lineHeight: "20px",
    color: colors.text,
    background: "#FFFFFF",
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    outline: "none",
    transition:
      "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    fontFamily: "inherit",
  };

  const inputFocusedStyle: React.CSSProperties = {
    borderColor: colors.borderFocus,
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.16)",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "4px",
  };

  const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    height: "46px",
    border: "none",
    borderRadius: "10px",
    background: primaryActive
      ? colors.primaryActive
      : primaryHover
      ? colors.primaryHover
      : colors.primary,
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: "pointer",
    transition: "background 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease",
    transform: primaryActive ? "translateY(1px)" : "translateY(0)",
    boxShadow: primaryHover
      ? "0 6px 16px rgba(79, 70, 229, 0.32)"
      : "0 2px 6px rgba(79, 70, 229, 0.24)",
    fontFamily: "inherit",
  };

  const ghostButtonStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    height: "46px",
    border: `1px solid ${ghostHover ? "#C7CBFF" : colors.border}`,
    borderRadius: "10px",
    background: ghostHover ? colors.ghostHoverBg : "transparent",
    color: colors.ghostText,
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease",
    fontFamily: "inherit",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={subtitleStyle}>Sign in to your Aperture account to continue.</p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit} noValidate>
          <div style={fieldStyle}>
            <label htmlFor="login-email" style={labelStyle}>
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{
                ...inputBase,
                ...(emailFocused ? inputFocusedStyle : null),
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="login-password" style={labelStyle}>
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{
                ...inputBase,
                ...(passwordFocused ? inputFocusedStyle : null),
              }}
            />
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="submit"
              style={primaryButtonStyle}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => {
                setPrimaryHover(false);
                setPrimaryActive(false);
              }}
              onMouseDown={() => setPrimaryActive(true)}
              onMouseUp={() => setPrimaryActive(false)}
            >
              Sign in
            </button>

            <button
              type="button"
              style={ghostButtonStyle}
              onMouseEnter={() => setGhostHover(true)}
              onMouseLeave={() => setGhostHover(false)}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
