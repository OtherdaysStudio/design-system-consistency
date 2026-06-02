import { Badge, Button, Card, Stack, Text } from '@/ds';

/**
 * NotificationToast — an elevated, horizontal success toast.
 *
 * Reuses only registered Aperture DS components:
 *  - Card (variant="elevated")  → the bounded, elevated surface
 *  - Stack                      → ALL spacing/layout (gap is a spacing-token enum)
 *  - Badge (tone="success")     → the success status dot
 *  - Text  (variant=…)          → ALL typography (title + body)
 *  - Button (variant="ghost")   → the trailing Undo action
 *
 * No raw <div>/<span>/<button>, no hardcoded color/space/radius/shadow literals.
 */
export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        <Badge tone="success" />
        <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
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
