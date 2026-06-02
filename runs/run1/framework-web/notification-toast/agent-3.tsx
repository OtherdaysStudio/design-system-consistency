import { Card, Badge, Button, Text, Stack } from '@/ds';

export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        <Badge tone="success">Saved</Badge>
        <Stack direction="column" gap="xs" align="start">
          <Text variant="title" color="primary">
            Saved
          </Text>
          <Text variant="body" color="secondary">
            Your changes were published.
          </Text>
        </Stack>
        <Button variant="ghost" size="sm">
          Undo
        </Button>
      </Stack>
    </Card>
  );
}

export default NotificationToast;
