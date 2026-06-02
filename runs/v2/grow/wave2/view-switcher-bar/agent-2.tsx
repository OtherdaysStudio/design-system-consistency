import { useState } from 'react';
import { Button, SegmentedControl, Stack } from '@/ds';

/**
 * ViewSwitcherBar — a toolbar row for the Aperture app.
 *
 * Left:  a registered <SegmentedControl> for switching between the mutually
 *        exclusive List / Grid / Map views (single-select, peer options).
 * Right: a primary <Button> that creates a new item.
 *
 * Composition only — every registered component is REUSED from '@/ds':
 *   - <SegmentedControl> for view switching (NOT re-implemented; it already
 *     exists in the design system).
 *   - <Button variant="primary"> for the action.
 *   - <Stack> for layout; gap is a spacing token, never a raw margin.
 * Type is set exclusively through the components' <Text>-backed variants and
 * spacing exclusively through <Stack gap>. There are no raw hex/px/rem/shadow
 * literals anywhere in this file.
 */

export type ViewMode = 'list' | 'grid' | 'map';

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

export interface ViewSwitcherBarProps {
  /** Currently active view. Controlled when provided. */
  view?: ViewMode;
  /** Fired with the newly selected view. */
  onViewChange?: (view: ViewMode) => void;
  /** Fired when the primary "New" button is pressed. */
  onNew?: () => void;
  /** Default selected view when uncontrolled. */
  defaultView?: ViewMode;
}

export function ViewSwitcherBar({
  view,
  onViewChange,
  onNew,
  defaultView = 'list',
}: ViewSwitcherBarProps) {
  const [internalView, setInternalView] = useState<ViewMode>(defaultView);
  const activeView = view ?? internalView;

  const handleViewChange = (next: ViewMode) => {
    if (view === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  return (
    <Stack
      direction="row"
      gap="md"
      align="center"
      style={{ justifyContent: 'space-between' }}
    >
      <SegmentedControl<ViewMode>
        options={VIEW_OPTIONS}
        value={activeView}
        onChange={handleViewChange}
        size="md"
        radius="pill"
        aria-label="Switch view"
      />

      <Button variant="primary" size="md" onClick={onNew}>
        New
      </Button>
    </Stack>
  );
}
