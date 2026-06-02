import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { token } from './tokens';

/**
 * Stack — flex layout primitive whose gap MUST be a spacing token. The main
 * defense against ad-hoc margins and raw gap literals.
 *
 * direction: row | column
 * gap:       none | xs | sm | md | lg | xl  (a spacing-token enum)
 * align:     start | center | end | stretch
 *
 * Never write <div style={{ display:'flex', gap:'12px' }}> — use <Stack gap="md">.
 */

export type StackDirection = 'row' | 'column';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

const GAP_TOKEN: Record<StackGap, string> = {
  none: token.space.none,
  xs: token.space.xs,
  sm: token.space.sm,
  md: token.space.md,
  lg: token.space.lg,
  xl: token.space.xl,
};

const ALIGN_VALUE: Record<StackAlign, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  /** Allow children to wrap onto multiple lines. */
  wrap?: boolean;
  children?: ReactNode;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'column', gap = 'md', align = 'stretch', wrap = false, style, children, ...rest },
  ref,
) {
  const baseStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap: GAP_TOKEN[gap],
    alignItems: ALIGN_VALUE[align],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style,
  };

  return (
    <div ref={ref} style={baseStyle} {...rest}>
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';
