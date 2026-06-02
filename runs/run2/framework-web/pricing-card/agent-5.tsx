import { Badge, Button, Card, Stack, Text } from '@/ds';

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="sm" align="start">
          <Badge tone="info">Most popular</Badge>
          <Text variant="heading" color="primary">
            Pro
          </Text>
          <Text variant="body" color="secondary">
            Everything you need to ship faster.
          </Text>
        </Stack>

        <Stack direction="row" gap="xs" align="end">
          <Text variant="display" color="primary">
            $29
          </Text>
          <Text variant="caption" color="muted">
            /mo
          </Text>
        </Stack>

        <Stack direction="column" gap="sm" align="stretch">
          <Text variant="body" color="secondary">
            Unlimited projects
          </Text>
          <Text variant="body" color="secondary">
            Advanced analytics
          </Text>
          <Text variant="body" color="secondary">
            Priority support
          </Text>
        </Stack>

        <Button variant="primary" size="lg">
          Choose Pro
        </Button>
      </Stack>
    </Card>
  );
}

export default PricingCard;
