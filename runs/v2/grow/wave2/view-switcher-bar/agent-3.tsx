import { useState } from 'react';
import { Button, SegmentedControl, Stack } from '@/ds';

/**
 * ViewSwitcherBar — a toolbar row for the Aperture app.
 *
 * Left:  a registered <SegmentedControl> for mutually-exclusive view switching
 *        between List / Grid / Map (a single-select choice among peers).
 * Right: a primary <Button> for the "New" action.
 *
 * Composition only — no hand-rolled controls. The segmented control is the
 * registered '@/ds' component (NOT a row of fake selected buttons), the button
 * is the registered primary <Button>, layout/spacing is expressed solely via
 * <Stack gap>, and every remaining style value references token.* — never a
 * raw hex/px/rem/shadow literal. The two ends are pushed apart by a layout-only
 * flex spacer (a ratio, not a styleable token value), since <Stack> exposes no
 * justify variant.
 */

export type AppView = 'list' | 'grid' | 'map';

const VIEW_OPTIONS: { value: AppView; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

export interface ViewSwitcherBarProps {
  /** Currently selected view. Controlled when provided. */
  view?: AppView;
  /** Fired when the user switches view. */
  onViewChange?: (view: AppView) => void;
  /** Fired when the primary "New" button is pressed. */
  onNew?: () => void;
}

export function ViewSwitcherBar({
  view,
  onViewChange,
  onNew,
}: ViewSwitcherBarProps) {
  const [internalView, setInternalView] = useState<AppView>('list');
  const selected = view ?? internalView;

  const handleChange = (next: AppView) => {
    if (view === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  return (
    <Stack direction="row" align="center" gap="md">
      <SegmentedControl
        options={VIEW_OPTIONS}
        value={selected}
        onChange={handleChange}
        size="md"
        radius="pill"
        aria-label="Switch view"
      />
      {/* Layout-only spacer: a flex ratio, never a design-token value. */}
      <div style={{ flex: 1 }} aria-hidden="true" />
      <Button variant="primary" size="md" onClick={onNew}>
        New
      </Button>
    </Stack>
  );
}
