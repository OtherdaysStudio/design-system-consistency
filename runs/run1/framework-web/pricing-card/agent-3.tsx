import { Badge, Button, Card, Stack, Text, token } from '@/ds';

const FEATURES = [
  'Unlimited projects',
  'Advanced analytics',
  'Priority support',
] as const;

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

        <Stack direction="column" gap="sm" align="stretch">
          {FEATURES.map((feature) => (
            <Stack key={feature} direction="row" gap="sm" align="center">
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: token.size.icon.sm,
                  height: token.size.icon.sm,
                  borderRadius: token.radius.pill,
                  backgroundColor: token.color.status.successBg,
                }}
              />
              <Text variant="body" color="primary">
                {feature}
              </Text>
            </Stack>
          ))}
        </Stack>

        <Stack direction="column" gap="none" align="stretch">
          <Button variant="primary" size="lg">
            Choose Pro
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default PricingCard;
