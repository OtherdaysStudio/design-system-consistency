import { token, Stack, Text } from '@/ds';

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlRadius = 'pill' | 'md';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /** 2-4 options; rendered as equal-width segments. */
  options: SegmentedControlOption<T>[];
  /** The currently selected option value. */
  value: T;
  onChange: (value: T) => void;
  size?: SegmentedControlSize;
  radius?: SegmentedControlRadius;
  'aria-label'?: string;
}

/**
 * SegmentedControl — a horizontal group of 2-4 mutually-exclusive, equal-width
 * segments for switching between views/options within a single context.
 * One segment is selected (primary fill + onAction text); the rest are muted.
 * Use for in-context view/option switching. NOT for triggering actions (use Button),
 * NOT for binary on/off (use Switch), and NOT for page navigation (use Link).
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  radius = 'pill',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const containerRadius = radius === 'pill' ? token.radius.pill : token.radius.md;
  const segmentRadius = radius === 'pill' ? token.radius.pill : token.radius.sm;
  const segmentPaddingY = size === 'sm' ? token.space.xs : token.space.sm;
  const segmentPaddingX = size === 'sm' ? token.space.sm : token.space.md;
  const textVariant = size === 'sm' ? 'caption' : 'label';

  return (
    <Stack
      direction="row"
      gap="xs"
      align="stretch"
      role="tablist"
      aria-label={ariaLabel}
      style={{
        backgroundColor: token.color.bg.muted,
        borderRadius: containerRadius,
        padding: token.space.xs,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              borderRadius: segmentRadius,
              paddingTop: segmentPaddingY,
              paddingBottom: segmentPaddingY,
              paddingLeft: segmentPaddingX,
              paddingRight: segmentPaddingX,
              backgroundColor: selected ? token.color.action.primary : 'transparent',
              boxShadow: selected ? token.shadow.sm : 'none',
              transitionProperty: 'background-color, box-shadow',
              transitionDuration: token.duration.fast,
              transitionTimingFunction: token.easing.standard,
            }}
          >
            <Text variant={textVariant} color={selected ? 'onAction' : 'muted'}>
              {option.label}
            </Text>
          </button>
        );
      })}
    </Stack>
  );
}
