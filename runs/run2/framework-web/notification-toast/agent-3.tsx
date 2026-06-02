import { Card, Stack, Badge, Text, Button } from '@/ds';

/**
 * NotificationToast — a transient success confirmation.
 *
 * Composition (reuse-before-create, one canonical path per decision):
 * - Surface      → <Card variant="elevated">  (elevated surface)
 * - Layout       → <Stack direction="row">     (horizontal; ALL spacing via gap)
 * - Status dot   → <Badge tone="success">      (most specific status component)
 * - Title 'Saved'→ <Text variant="label">      (bold UI-text preset)
 * - Body line    → <Text variant="body" color="secondary">
 * - 'Undo'       → <Button variant="ghost">
 *
 * Type only via <Text variant>. Spacing only via <Stack gap>. No raw literals.
 */
export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        <Badge tone="success" aria-hidden />

        <Stack direction="column" gap="xs" align="start">
          <Text variant="label">Saved</Text>
          <Text variant="body" color="secondary">
            Your changes were published.
          </Text>
        </Stack>

        {/* Flexible spacer pushes the action to the right — layout flag, no design token. */}
        <Stack direction="row" gap="none" style={{ flex: 1 }} />

        <Button variant="ghost" size="sm">
          Undo
        </Button>
      </Stack>
    </Card>
  );
}

export default NotificationToast;
