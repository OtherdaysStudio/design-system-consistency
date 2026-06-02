import { Card, Badge, Text, Stack } from '@/ds';

// Fix (review): +12.5% sits NEXT TO $48.2k (row), not underneath; hero type for impact.
export function StatCard() {
  return (
    <Card variant="default">
      <Stack direction="column" gap="sm" align="start">
        <Text variant="caption" color="secondary">Monthly revenue</Text>
        <Stack direction="row" gap="sm" align="center">
          <Text variant="hero" color="primary">$48.2k</Text>
          <Badge tone="success">+12.5%</Badge>
        </Stack>
      </Stack>
    </Card>
  );
}
export default StatCard;
