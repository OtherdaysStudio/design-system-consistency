import { Card, Stack, Switch, Text, token } from '@/ds';

export function SettingsRow() {
  return (
    <Card variant="default">
      <Stack
        direction="row"
        gap="md"
        align="center"
        style={{ padding: token.space.md }}
      >
        <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
          <Text variant="label" color="primary">
            Push notifications
          </Text>
          <Text variant="caption" color="secondary">
            Get notified about activity
          </Text>
        </Stack>
        <Switch size="md" defaultChecked />
      </Stack>
    </Card>
  );
}
