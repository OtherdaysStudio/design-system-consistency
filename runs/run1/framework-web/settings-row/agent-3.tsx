import { Card, Stack, Text, Switch, token } from '@/ds';

export function SettingsRow() {
  return (
    <Card variant="default">
      <Stack direction="row" align="center" gap="md">
        <div style={{ flex: 1, minWidth: token.space.none }}>
          <Stack direction="column" gap="xs">
            <Text variant="label" color="primary">
              Push notifications
            </Text>
            <Text variant="caption" color="secondary">
              Get notified about activity
            </Text>
          </Stack>
        </div>
        <Switch size="md" checked />
      </Stack>
    </Card>
  );
}

export default SettingsRow;
