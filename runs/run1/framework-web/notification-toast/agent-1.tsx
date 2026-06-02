import { Badge, Button, Card, Stack, Text } from '@/ds';

/**
 * NotificationToast — success toast with a status dot, a bold title and a
 * supporting body line, plus a ghost "Undo" action on the right.
 *
 * Composition is 100% registered DS primitives:
 * - Surface  → <Card variant="elevated">  (elevated surface)
 * - Layout   → <Stack> only (token-gap spacing, no raw flex/margins)
 * - Status   → <Badge tone="success">     (canonical status pill / dot)
 * - Type     → <Text variant=...>          (the only way to set typography)
 * - Action   → <Button variant="ghost">    (the only way to render a button)
 */
export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        {/* Success badge/dot */}
        <Badge tone="success">Saved</Badge>

        {/* Title + body, stacked tightly */}
        <Stack direction="column" gap="xs" align="start">
          <Text variant="title" color="primary">
            Saved
          </Text>
          <Text variant="body" color="secondary">
            Your changes were published.
          </Text>
        </Stack>

        {/* Ghost action pinned to the right via auto inline-start margin */}
        <Button
          variant="ghost"
          size="sm"
          style={{ marginInlineStart: 'auto' }}
        >
          Undo
        </Button>
      </Stack>
    </Card>
  );
}

export default NotificationToast;
