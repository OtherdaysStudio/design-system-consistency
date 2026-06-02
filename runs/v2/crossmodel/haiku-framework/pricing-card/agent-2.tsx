import {
  Button,
  Card,
  Badge,
  Text,
  Stack,
  token,
} from '@/ds';

export function PricingCard() {
  return (
    <Card variant="elevated" style={{ padding: token.space.lg }}>
      <Stack direction="column" gap="md" align="stretch">
        <Badge tone="info">Most popular</Badge>

        <Text variant="heading" color="primary">
          Pro
        </Text>

        <Text variant="body" color="secondary">
          Perfect for growing teams
        </Text>

        <Stack direction="column" gap="none" align="start">
          <Stack direction="row" gap="xs" align="center">
            <Text variant="display" color="primary">
              $29
            </Text>
            <Text variant="label" color="muted">
              /mo
            </Text>
          </Stack>
        </Stack>

        <Stack direction="column" gap="sm" align="start">
          <Text variant="body" color="primary">
            ✓ Unlimited projects
          </Text>
          <Text variant="body" color="primary">
            ✓ Team collaboration
          </Text>
          <Text variant="body" color="primary">
            ✓ Advanced analytics
          </Text>
        </Stack>

        <Button variant="primary" size="md" style={{ width: '100%' }}>
          Get started
        </Button>
      </Stack>
    </Card>
  );
}
