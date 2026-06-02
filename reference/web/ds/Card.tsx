import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { token } from './tokens';

/**
 * Card — a bounded surface that groups related content with consistent inset,
 * radius, and elevation.
 *
 * variant: default | elevated  (elevated adds shadow.md)
 *
 * Never hand-roll a <div> with inline padding/border-radius/box-shadow.
 */

export type CardVariant = 'default' | 'elevated';

export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Inset: `md` (default, card.padding) for content cards, `sm` for dense list rows. */
  padding?: CardPadding;
  children?: ReactNode;
}

const PADDING_TOKEN: Record<CardPadding, string> = {
  sm: token.space.md,   // 16 — compact list rows
  md: token.card.padding, // 24 — default content card
  lg: token.space.xl,   // 32 — roomy
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', padding = 'md', className, style, children, ...rest },
  ref,
) {
  const baseStyle: CSSProperties = {
    background: token.card.bg,
    padding: PADDING_TOKEN[padding],
    borderRadius: token.card.radius,
    border: `${token.borderWidth.thin} solid ${token.card.border}`,
    boxShadow: variant === 'elevated' ? token.shadow.md : undefined,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={baseStyle} {...rest}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
