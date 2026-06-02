import { Card, Stack, Text, Switch, token } from '@/ds';

export function SettingsRow() {
  return (
    <Card variant="default">
      <Stack
        direction="row"
        gap="md"
        align="center"
        style={{ justifyContent: 'space-between', padding: token.space.md }}
      >
        <Stack direction="column" gap="xs" align="start">
          <Text variant="label" color="primary">
            Push notifications
          </Text>
          <Text variant="caption" color="secondary">
            Get notified about activity
          </Text>
        </Stack>
        <Switch size="md" checked />
      </Stack>
    </Card>
  );
}

export default SettingsRow;
