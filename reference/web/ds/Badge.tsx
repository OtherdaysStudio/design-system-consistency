import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { token } from './tokens';

/**
 * Badge — a small inline status/label pill.
 *
 * tone: neutral | success | warning | danger | info
 *
 * Pill radius (badge.radius), caption typography, and status color tokens.
 * Never hand-roll a <span> with inline background + border-radius:999px.
 */

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface ToneStyle {
  background: string;
  color: string;
}

const TONE_STYLE: Record<BadgeTone, ToneStyle> = {
  neutral: { background: token.color.bg.muted, color: token.color.text.secondary },
  success: { background: token.color.status.successBg, color: token.color.status.success },
  warning: { background: token.color.status.warningBg, color: token.color.status.warning },
  danger: { background: token.color.status.dangerBg, color: token.color.status.danger },
  info: { background: token.color.status.infoBg, color: token.color.status.info },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', className, style, children, ...rest },
  ref,
) {
  const t = TONE_STYLE[tone];

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: token.space.xs,
    background: t.background,
    color: t.color,
    paddingInline: token.badge.paddingX,
    paddingBlock: token.space.xs,
    borderRadius: token.badge.radius,
    whiteSpace: 'nowrap',
    ...style,
  };

  return (
    <span
      ref={ref}
      className={['type-caption', className].filter(Boolean).join(' ')}
      style={baseStyle}
      {...rest}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
