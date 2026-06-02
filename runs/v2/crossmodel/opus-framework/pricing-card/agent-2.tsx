import { Button, Card, Badge, Text, Stack } from '@/ds';

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="md" align="start">
          <Badge tone="info">Most popular</Badge>
          <Stack direction="column" gap="xs" align="start">
            <Text variant="heading" color="primary">
              Pro
            </Text>
            <Text variant="body" color="secondary">
              Everything you need to ship faster.
            </Text>
          </Stack>
        </Stack>

        <Stack direction="row" gap="xs" align="end">
          <Text variant="display" color="primary">
            $29
          </Text>
          <Text variant="caption" color="muted">
            /mo
          </Text>
        </Stack>

        <Stack direction="column" gap="sm" align="start">
          <Text variant="body" color="secondary">
            Unlimited projects
          </Text>
          <Text variant="body" color="secondary">
            Priority support
          </Text>
          <Text variant="body" color="secondary">
            Advanced analytics
          </Text>
        </Stack>

        <Button variant="primary" size="lg">
          Get started
        </Button>
      </Stack>
    </Card>
  );
}
