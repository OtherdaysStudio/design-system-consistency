import { Badge, Button, Card, Stack, Text, token } from '@/ds';

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="sm" align="start">
          <Badge tone="info">Most popular</Badge>
          <Text variant="heading" color="primary">Pro</Text>
          <Text variant="body" color="secondary">Everything you need to grow your creative workflow.</Text>
        </Stack>

        <Stack direction="column" gap="none" align="start">
          <Stack direction="row" gap="xs" align="end">
            <Text variant="display" color="primary">$29</Text>
            <Text variant="body" color="muted">/mo</Text>
          </Stack>
        </Stack>

        <Stack direction="column" gap="sm" align="start">
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Unlimited projects and exports</Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Advanced editing and filters</Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Priority support and early access</Text>
          </Stack>
        </Stack>

        <Button variant="primary" size="lg" style={{ width: '100%' }}>
          Get started with Pro
        </Button>
      </Stack>
    </Card>
  );
}
