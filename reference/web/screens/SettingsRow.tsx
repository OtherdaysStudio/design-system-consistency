import { Card, Stack, Text, Switch } from '@/ds';

// Fixes (review): toggle → far right (justify="between"); tighter label/helper gap
// (gap="none"); less top/bottom (Card padding="sm").
export function SettingsRow() {
  return (
    <Card variant="default" padding="sm">
      <Stack direction="row" justify="between" align="center">
        <Stack direction="column" gap="none" align="start">
          <Text variant="label" color="primary">Push notifications</Text>
          <Text variant="caption" color="secondary">Get notified about activity</Text>
        </Stack>
        <Switch size="md" checked />
      </Stack>
    </Card>
  );
}
export default SettingsRow;
