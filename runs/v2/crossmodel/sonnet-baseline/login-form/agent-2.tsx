import React, { useState } from "react";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 40px -10px rgba(0, 0, 0, 0.12)",
      padding: "48px 40px",
      width: "100%",
      maxWidth: "420px",
      boxSizing: "border-box",
    },
    logoMark: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      backgroundColor: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "28px",
    },
    logoInner: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: "2.5px solid #ffffff",
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoLine: {
      width: "2px",
      height: "10px",
      backgroundColor: "#ffffff",
      position: "absolute" as const,
    },
    title: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#0f0f0f",
      margin: "0 0 8px 0",
      letterSpacing: "-0.3px",
      lineHeight: "1.2",
    },
    subtitle: {
      fontSize: "15px",
      color: "#6b7280",
      margin: "0 0 32px 0",
      lineHeight: "1.5",
      fontWeight: 400,
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      marginBottom: "24px",
    },
    field: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      fontWeight: 500,
      color: "#374151",
      letterSpacing: "0.01em",
    },
    input: (focused: boolean): React.CSSProperties => ({
      padding: "11px 14px",
      fontSize: "15px",
      color: "#111827",
      backgroundColor: focused ? "#ffffff" : "#fafafa",
      border: focused ? "1.5px solid #1a1a1a" : "1.5px solid #e5e7eb",
      borderRadius: "10px",
      outline: "none",
      transition: "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
      boxShadow: focused
        ? "0 0 0 3px rgba(26, 26, 26, 0.08)"
        : "none",
      width: "100%",
      boxSizing: "border-box" as const,
    }),
    forgotRow: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "-8px",
    },
    forgotLink: {
      fontSize: "13px",
      color: "#6b7280",
      textDecoration: "none",
      fontWeight: 500,
      cursor: "pointer",
      transition: "color 0.15s ease",
    },
    buttonStack: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    primaryButton: (hovered: boolean): React.CSSProperties => ({
      width: "100%",
      padding: "13px 20px",
      fontSize: "15px",
      fontWeight: 600,
      color: "#ffffff",
      backgroundColor: hovered ? "#2d2d2d" : "#1a1a1a",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background-color 0.15s ease, transform 0.1s ease",
      transform: hovered ? "translateY(-1px)" : "translateY(0)",
      boxShadow: hovered
        ? "0 4px 12px rgba(26, 26, 26, 0.25)"
        : "0 2px 6px rgba(26, 26, 26, 0.15)",
      letterSpacing: "0.01em",
    }),
    secondaryButton: (hovered: boolean): React.CSSProperties => ({
      width: "100%",
      padding: "12px 20px",
      fontSize: "15px",
      fontWeight: 500,
      color: hovered ? "#0f0f0f" : "#374151",
      backgroundColor: hovered ? "#f3f4f6" : "transparent",
      border: "1.5px solid #e5e7eb",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
      borderColor: hovered ? "#d1d5db" : "#e5e7eb",
      letterSpacing: "0.01em",
    }),
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "4px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#e5e7eb",
    },
    dividerText: {
      fontSize: "12px",
      color: "#9ca3af",
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.logoMark}>
          <div style={styles.logoInner}>
            <div style={styles.logoLine} />
          </div>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your Aperture account to continue.</p>

        <div style={styles.fieldGroup}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={styles.input(emailFocused)}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={styles.input(passwordFocused)}
              autoComplete="current-password"
            />
          </div>

          <div style={styles.forgotRow}>
            <a href="#" style={styles.forgotLink}>
              Forgot password?
            </a>
          </div>
        </div>

        <div style={styles.buttonStack}>
          <button
            type="submit"
            style={styles.primaryButton(primaryHovered)}
            onMouseEnter={() => setPrimaryHovered(true)}
            onMouseLeave={() => setPrimaryHovered(false)}
          >
            Sign in
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <button
            type="button"
            style={styles.secondaryButton(secondaryHovered)}
            onMouseEnter={() => setSecondaryHovered(true)}
            onMouseLeave={() => setSecondaryHovered(false)}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
