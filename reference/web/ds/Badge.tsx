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
  /** Prepend a small filled status dot in the tone color (e.g. a "saved" indicator). */
  dot?: boolean;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', dot = false, className, style, children, ...rest },
  ref,
) {
  const t = TONE_STYLE[tone];
  const dotOnly = dot && (children == null || children === '');

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: token.space.xs,
    background: dotOnly ? 'transparent' : t.background,
    color: t.color,
    paddingInline: dotOnly ? token.space.none : token.badge.paddingX,
    paddingBlock: dotOnly ? token.space.none : token.space.xs,
    borderRadius: token.badge.radius,
    whiteSpace: 'nowrap',
    ...style,
  };
  const dotStyle: CSSProperties = {
    width: token.space.sm,
    height: token.space.sm,
    borderRadius: token.radius.pill,
    background: t.color,
    flex: '0 0 auto',
  };

  return (
    <span
      ref={ref}
      className={['type-caption', className].filter(Boolean).join(' ')}
      style={baseStyle}
      {...rest}
    >
      {dot && <span aria-hidden style={dotStyle} />}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
