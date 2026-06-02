import { Badge, Button, Card, Stack, Text } from '@/ds';

// Fixes (review): no duplicated "Saved" (status DOT instead of the word); title
// (label) is larger/bolder than the supporting line (caption); "Undo" is a real
// button (secondary), pushed to the far right (justify="between").
export function NotificationToast() {
  return (
    <Card variant="elevated" padding="sm">
      <Stack direction="row" gap="md" align="center" justify="between">
        <Stack direction="row" gap="sm" align="center">
          <Badge tone="success" dot />
          <Stack direction="column" gap="none" align="start">
            <Text variant="label" color="primary">Saved</Text>
            <Text variant="caption" color="secondary">Your changes were published.</Text>
          </Stack>
        </Stack>
        <Button variant="secondary" size="sm">Undo</Button>
      </Stack>
    </Card>
  );
}
export default NotificationToast;
