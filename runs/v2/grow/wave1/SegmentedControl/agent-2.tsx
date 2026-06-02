import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { token, Stack, Text } from '@/ds';

/**
 * SegmentedControl — a horizontal, mutually-exclusive option group.
 *
 * 2–4 equal-width segments where exactly one is selected at a time. The
 * selected segment gets the primary action fill + onAction text; the rest are
 * muted. Use it to switch between a small, fixed set of views/options that are
 * peers (e.g. List | Grid, Day | Week | Month).
 *
 * size:   sm | md   (segment height tracks size.control.*)
 * radius: pill | md  (outer track + selected indicator radius)
 *
 * NOT for: navigation between pages (use a Link/tab nav), binary on/off
 * (use <Switch>), or >4 options / free text (use a Select). All color,
 * spacing, radius and typography are token-driven — never inline literals.
 */

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlRadius = 'pill' | 'md';

export interface SegmentOption<T extends string = string> {
  /** Stable value emitted on selection. */
  value: T;
  /** Visible segment label. */
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  /** 2–4 peer options rendered as equal-width segments. */
  options: SegmentOption<T>[];
  /** The currently selected option's value. */
  value: T;
  onValueChange?: (value: T) => void;
  size?: SegmentedControlSize;
  radius?: SegmentedControlRadius;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  style?: CSSProperties;
}

const HEIGHT: Record<SegmentedControlSize, string> = {
  sm: token.size.control.sm,
  md: token.size.control.md,
};

const RADIUS: Record<SegmentedControlRadius, string> = {
  pill: token.radius.pill,
  md: token.radius.md,
};

/** Inner segment radius sits one step in from the track for the pill look. */
const SEGMENT_RADIUS: Record<SegmentedControlRadius, string> = {
  pill: token.radius.pill,
  md: token.radius.sm,
};

function SegmentedControlInner<T extends string = string>(
  {
    options,
    value,
    onValueChange,
    size = 'md',
    radius = 'pill',
    disabled = false,
    className,
    style,
    ...aria
  }: SegmentedControlProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const trackStyle: CSSProperties = {
    display: 'flex',
    height: HEIGHT[size],
    padding: token.space.xs,
    background: token.color.bg.muted,
    borderRadius: RADIUS[radius],
    border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
    opacity: disabled ? 0.5 : 1,
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      className={className}
      style={trackStyle}
      {...aria}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;

        const segmentStyle: CSSProperties = {
          flex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: token.space.md,
          border: 'none',
          borderRadius: SEGMENT_RADIUS[radius],
          background: selected ? token.color.action.primary : 'transparent',
          boxShadow: selected ? token.shadow.sm : 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: `background ${token.duration.fast} ${token.easing.standard}`,
          whiteSpace: 'nowrap',
          minWidth: 0,
        };

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={isDisabled}
            style={segmentStyle}
            onClick={() => {
              if (!isDisabled && !selected) onValueChange?.(option.value);
            }}
          >
            <Stack direction="row" gap="none" align="center">
              <Text variant="label" color={selected ? 'onAction' : 'muted'}>
                {option.label}
              </Text>
            </Stack>
          </button>
        );
      })}
    </div>
  );
}

export const SegmentedControl = forwardRef(SegmentedControlInner) as <
  T extends string = string,
>(
  props: SegmentedControlProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

(SegmentedControl as unknown as { displayName: string }).displayName =
  'SegmentedControl';
