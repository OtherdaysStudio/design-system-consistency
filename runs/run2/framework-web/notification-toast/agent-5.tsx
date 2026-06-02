import { Badge, Button, Card, Stack, Text } from '@/ds';

/**
 * NotificationToast — an elevated, horizontal success toast: a success
 * badge/dot, a bold "Saved" title with a "Your changes were published."
 * body line, and a ghost "Undo" action pinned to the right.
 *
 * Aperture DS convergence notes:
 * - REUSE only registered components (Card, Stack, Badge, Text, Button) —
 *   nothing hand-rolled.
 * - Surface is the most specific registered surface: <Card variant="elevated">.
 * - The success dot is the most specific status component: <Badge tone="success">.
 * - Typography ONLY through <Text variant>: "label" = short bold title,
 *   "body" = supporting line; no inline font-size/weight/line-height.
 * - The action is the most specific registered control: <Button variant="ghost">.
 * - ALL spacing/layout flows through <Stack gap> (a spacing-token enum) — never
 *   a raw gap/margin/padding literal, never spacing on a raw element.
 * - Variants are fixed enums; zero raw hex/px/rem/rgba/shadow literals.
 */
export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        <Badge tone="success" aria-label="Success" />

        <Stack direction="column" gap="xs" align="start">
          <Text variant="label" color="primary">
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
