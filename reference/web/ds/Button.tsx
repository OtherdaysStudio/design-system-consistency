import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { token } from './tokens';

/**
 * Button — triggers an action. NOT for navigation (use a Link for that).
 *
 * variant: primary | secondary | danger | ghost
 * size:    sm | md | lg  (mapped to size.control.*)
 *
 * Typography comes from the `.type-label` preset; all color/spacing/radius is
 * token-driven. Never hand-roll a <button> with inline padding/background.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const SIZE_HEIGHT: Record<ButtonSize, string> = {
  sm: token.size.control.sm,
  md: token.size.control.md,
  lg: token.size.control.lg,
};

interface VariantStyle {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
}

const VARIANT_STYLE: Record<ButtonVariant, VariantStyle> = {
  primary: {
    background: token.button.bg.primary,
    color: token.button.fg.primary,
    border: 'transparent',
    hoverBackground: token.color.action.primaryHover,
  },
  secondary: {
    background: token.color.action.secondary,
    color: token.color.text.primary,
    border: token.color.border.default,
    hoverBackground: token.color.bg.muted,
  },
  danger: {
    background: token.color.action.danger,
    color: token.color.text.onAction,
    border: 'transparent',
    hoverBackground: token.color.action.dangerHover,
  },
  ghost: {
    background: 'transparent',
    color: token.color.text.primary,
    border: 'transparent',
    hoverBackground: token.color.bg.muted,
  },
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading element (icon). Spaced from label by button.gap. */
  leading?: ReactNode;
  /** Optional trailing element (icon). Spaced from label by button.gap. */
  trailing?: ReactNode;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    leading,
    trailing,
    disabled,
    className,
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const v = VARIANT_STYLE[variant];

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: token.button.gap,
    height: SIZE_HEIGHT[size],
    paddingInline: token.button.paddingX,
    borderRadius: token.button.radius,
    background: v.background,
    color: v.color,
    border: `${token.borderWidth.thin} solid ${v.border}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background 120ms ease',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={['type-label', className].filter(Boolean).join(' ')}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = v.hoverBackground;
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = v.background;
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
});

Button.displayName = 'Button';
