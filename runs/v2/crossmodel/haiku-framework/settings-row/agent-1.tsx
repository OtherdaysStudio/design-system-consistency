import { Card, Stack, Text, Switch, token } from '@/ds';

export const SettingsRow = () => {
  return (
    <Card variant="default">
      <Stack
        direction="row"
        gap="md"
        align="center"
        style={{
          padding: `${token.space.md} ${token.space.lg}`,
        }}
      >
        <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
          <Text variant="body" color="primary">
            Push notifications
          </Text>
          <Text variant="caption" color="muted">
            Get notified about activity
          </Text>
        </Stack>
        <Switch size="md" defaultChecked={true} />
      </Stack>
    </Card>
  );
};
