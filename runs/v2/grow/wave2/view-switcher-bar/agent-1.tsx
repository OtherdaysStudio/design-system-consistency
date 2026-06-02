import { useState } from 'react';
import { SegmentedControl, Button, Stack } from '@/ds';

export type ViewMode = 'list' | 'grid' | 'map';

export interface ViewSwitcherBarProps {
  /** The currently active view. Controlled when provided. */
  value?: ViewMode;
  /** Initial view when used uncontrolled. */
  defaultValue?: ViewMode;
  /** Fired with the newly selected view. */
  onChange?: (value: ViewMode) => void;
  /** Fired when the primary "New" action is triggered. */
  onNew?: () => void;
}

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

/**
 * ViewSwitcherBar — a toolbar row with a left-aligned SegmentedControl for
 * switching between List / Grid / Map views and a right-aligned primary
 * "New" Button.
 *
 * Reuses the registered <SegmentedControl> (single-select, mutually exclusive
 * view switching), <Button> (the primary action), and <Stack> (all layout +
 * spacing). No type, spacing, or style literals are introduced here.
 */
export function ViewSwitcherBar({
  value,
  defaultValue = 'list',
  onChange,
  onNew,
}: ViewSwitcherBarProps) {
  const [internal, setInternal] = useState<ViewMode>(defaultValue);
  const current = value ?? internal;

  const handleChange = (next: ViewMode) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <Stack direction="row" gap="md" align="center">
      <SegmentedControl<ViewMode>
        options={VIEW_OPTIONS}
        value={current}
        onChange={handleChange}
        size="md"
        radius="pill"
        aria-label="Switch view"
      />

      {/* Spacer: pushes the primary action to the trailing edge. */}
      <div style={{ flex: 1, minWidth: 0 }} />

      <Button variant="primary" size="md" onClick={onNew}>
        New
      </Button>
    </Stack>
  );
}
