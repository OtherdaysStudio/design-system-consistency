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

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', className, style, children, ...rest },
  ref,
) {
  const baseStyle: CSSProperties = {
    background: token.card.bg,
    padding: token.card.padding,
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
