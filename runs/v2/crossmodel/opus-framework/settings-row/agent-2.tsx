import { useState } from 'react';
import { Card, Stack, Text, Switch } from '@/ds';

/**
 * SettingsRow — a single settings list row on a surface.
 *
 * Layout: <Card> provides the surface + comfortable token-driven inset.
 * A row <Stack> holds the label/helper column on the left and a right-aligned
 * <Switch>. Vertical spacing between label and helper is a <Stack gap>.
 *
 * Reuse-only: Card (surface), Stack (all spacing/layout), Text (all type),
 * Switch (the toggle). No raw <div>/<span>, no literal colors/px/radius/shadow.
 */
export function SettingsRow() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Card>
      <Stack direction="row" align="center" gap="md">
        {/* Left: label + helper. Grows to push the Switch to the right edge. */}
        <Stack direction="column" gap="xs" style={{ flex: 1 }}>
          <Text variant="label" color="primary" id="push-notifications-label">
            Push notifications
          </Text>
          <Text variant="caption" color="muted">
            Get notified about activity
          </Text>
        </Stack>

        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          size="md"
          aria-labelledby="push-notifications-label"
        />
      </Stack>
    </Card>
  );
}

export default SettingsRow;
