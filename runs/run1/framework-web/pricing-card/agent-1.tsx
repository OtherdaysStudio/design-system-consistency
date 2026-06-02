import { Badge, Button, Card, Stack, Text } from '@/ds';

const FEATURES = [
  'Unlimited projects',
  'Priority support',
  'Advanced analytics',
] as const;

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="row" align="start">
          <Badge tone="info">Most popular</Badge>
        </Stack>

        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            Pro
          </Text>
          <Text variant="body" color="secondary">
            Everything you need to scale your team.
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

        <Stack direction="column" gap="sm" align="start">
          {FEATURES.map((feature) => (
            <Text key={feature} variant="body" color="secondary">
              {feature}
            </Text>
          ))}
        </Stack>

        <Stack direction="column" align="stretch">
          <Button variant="primary" size="lg">
            Choose Pro
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default PricingCard;
