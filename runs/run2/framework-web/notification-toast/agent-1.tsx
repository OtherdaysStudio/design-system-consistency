import { Badge, Button, Card, Stack, Text } from '@/ds';

/**
 * NotificationToast — success toast with a status dot, a bold title and body
 * line, and a ghost "Undo" action on the right.
 *
 * Consistency notes (Aperture DS convergence protocol):
 * - Surface ALWAYS <Card variant="elevated"> — never a hand-rolled div with
 *   inline shadow/radius/padding.
 * - Status pill/dot ALWAYS <Badge tone="success"> — the most specific
 *   registered component for a status indicator.
 * - ALL spacing/layout expressed only through <Stack gap=...> — no raw gap,
 *   margin, or padding literals on any element.
 * - Typography ONLY via <Text variant=...> ("label" = short bold title,
 *   "body" = supporting line); no inline font-size/weight/line-height.
 * - The action is the most specific registered control: <Button variant="ghost">.
 * - Zero raw hex/px/rem/rgba/shadow literals; every value is a fixed enum or a
 *   token reference encoded inside a registered component.
 */
export function NotificationToast() {
  return (
    <Card variant="elevated">
      <Stack direction="row" gap="md" align="center">
        <Badge tone="success">Saved</Badge>

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
