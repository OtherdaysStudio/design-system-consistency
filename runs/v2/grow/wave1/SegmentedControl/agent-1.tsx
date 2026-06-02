import { Stack, Text, token } from '@/ds';

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlRadius = 'pill' | 'md';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /** 2-4 equal-width segments. */
  options: SegmentedControlOption<T>[];
  /** The currently selected segment value. */
  value: T;
  /** Fired with the newly selected value. */
  onChange: (value: T) => void;
  /** Control height preset. */
  size?: SegmentedControlSize;
  /** Outer + segment corner shape. */
  radius?: SegmentedControlRadius;
  /** Accessible label for the group. */
  'aria-label'?: string;
}

const HEIGHT: Record<SegmentedControlSize, string> = {
  sm: token.size.control.sm,
  md: token.size.control.md,
};

const PAD_X: Record<SegmentedControlSize, string> = {
  sm: token.space.sm,
  md: token.space.md,
};

const RADIUS: Record<SegmentedControlRadius, string> = {
  pill: token.radius.pill,
  md: token.radius.md,
};

/**
 * SegmentedControl — a horizontal, single-select group of 2-4 equal-width
 * segments where exactly one is active. Use for mutually exclusive view/option
 * switching (e.g. List/Grid, Day/Week/Month). NOT for navigation between routes
 * (use a nav/tab pattern), NOT for binary on/off (use <Switch>), and NOT for
 * multi-select or triggering actions (use <Button>).
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  radius = 'pill',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <Stack
      direction="row"
      gap="xs"
      align="stretch"
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        backgroundColor: token.color.bg.muted,
        borderRadius: RADIUS[radius],
        padding: token.space.xs,
        border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: HEIGHT[size],
              paddingLeft: PAD_X[size],
              paddingRight: PAD_X[size],
              border: 'none',
              cursor: 'pointer',
              borderRadius: RADIUS[radius],
              backgroundColor: selected ? token.color.action.primary : 'transparent',
              transitionProperty: 'background-color, color',
              transitionDuration: token.duration.fast,
              transitionTimingFunction: token.easing.standard,
            }}
          >
            <Text variant="label" color={selected ? 'onAction' : 'muted'}>
              {option.label}
            </Text>
          </button>
        );
      })}
    </Stack>
  );
}
