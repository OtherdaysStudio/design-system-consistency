import { Badge, Button, Card, Stack, Text, token } from '@/ds';

export function PricingCard() {
  return (
    <Card variant="elevated" style={{ width: '320px' }}>
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="sm">
          <Badge tone="info">Most popular</Badge>
          <Text variant="heading" color="primary">Pro</Text>
          <Text variant="body" color="secondary">Everything you need to grow your creative workflow.</Text>
        </Stack>

        <Stack direction="column" gap="none">
          <Stack direction="row" gap="xs" align="end">
            <Text variant="display" color="primary">$29</Text>
            <Text variant="body" color="muted">/mo</Text>
          </Stack>
        </Stack>

        <Stack direction="column" gap="sm">
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Unlimited projects and exports</Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Priority rendering and processing</Text>
          </Stack>
          <Stack direction="row" gap="sm" align="center">
            <Text variant="body" color="secondary" style={{ color: token['color.status.success'] }}>✓</Text>
            <Text variant="body" color="secondary">Advanced collaboration tools</Text>
          </Stack>
        </Stack>

        <Button variant="primary" size="lg" style={{ width: '100%' }}>
          Get started with Pro
        </Button>
      </Stack>
    </Card>
  );
}
