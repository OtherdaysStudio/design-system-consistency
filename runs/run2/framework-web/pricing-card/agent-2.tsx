import { Button, Card, Badge, Text, Stack } from '@/ds';

const FEATURES = [
  'Unlimited projects',
  'Priority support',
  'Advanced analytics',
];

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="row" gap="none" align="start">
          <Badge tone="info">Most popular</Badge>
        </Stack>

        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            Pro
          </Text>
          <Text variant="body" color="secondary">
            Everything you need to scale your work.
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
          {FEATURES.map((feature) => (
            <Stack key={feature} direction="row" gap="sm" align="center">
              <Text variant="label" color="secondary">
                ✓
              </Text>
              <Text variant="body" color="primary">
                {feature}
              </Text>
            </Stack>
          ))}
        </Stack>

        <Button variant="primary" size="lg">
          Choose Pro
        </Button>
      </Stack>
    </Card>
  );
}

export default PricingCard;
