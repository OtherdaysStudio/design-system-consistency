import { forwardRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { token } from './tokens';

/**
 * Switch — accessible binary on/off control with token-driven track/thumb.
 *
 * size: sm | md
 *
 * Implemented as a native <button role="switch"> so it is keyboard- and
 * screen-reader-accessible out of the box (Space/Enter toggles, aria-checked
 * reflects state). Never hand-roll a styled checkbox as a toggle.
 */

export type SwitchSize = 'sm' | 'md';

interface SwitchGeometry {
  /** Track height; the control height baseline. */
  height: string;
  /** Track width. */
  width: string;
  /** Thumb diameter. */
  thumb: string;
  /** Inset between thumb and track edge. */
  inset: string;
}

// Geometry is derived from on-scale spacing tokens (no raw px literals).
const GEOMETRY: Record<SwitchSize, SwitchGeometry> = {
  sm: {
    height: token.space.md, // 16px
    width: token.space.xl, // 32px
    thumb: token.space.sm, // 8px (+2*inset → fills track)
    inset: token.space.xs, // 4px
  },
  md: {
    height: token.space.lg, // 24px
    width: token.space.xxl, // 48px
    thumb: token.space.md, // 16px (+2*inset → fills track)
    inset: token.space.xs, // 4px
  },
};

export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  /** Accessible label when no visible label is associated. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    onCheckedChange,
    size = 'md',
    disabled = false,
    className,
    style,
    ...aria
  },
  ref,
) {
  const g = GEOMETRY[size];

  const toggle = () => {
    if (!disabled) onCheckedChange?.(!checked);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: g.width,
    height: g.height,
    padding: 0,
    border: 'none',
    borderRadius: token.radius.pill,
    background: checked ? token.color.action.primary : token.color.bg.muted,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background var(--duration-press, 120ms) ease',
    flexShrink: 0,
    ...style,
  };

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: g.inset,
    left: g.inset,
    width: g.thumb,
    height: g.thumb,
    borderRadius: token.radius.pill,
    background: token.color.bg.surface,
    boxShadow: token.shadow.sm,
    // Slide to the right edge: track width minus thumb width minus both insets.
    transform: checked
      ? `translateX(calc(${g.width} - ${g.thumb} - ${g.inset} - ${g.inset}))`
      : 'translateX(0)',
    // Thumb glides on the Snap spring (transform-only). Source: /springy-motion.
    transition: 'transform var(--duration-snap, 300ms) var(--easing-snap, ease)',
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={className}
      style={trackStyle}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      {...aria}
    >
      <span aria-hidden style={thumbStyle} />
    </button>
  );
});

Switch.displayName = 'Switch';
