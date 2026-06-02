import { Card, Stack, Text, Badge } from '@/ds';

export function StatCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="sm" align="start">
        <Text variant="caption" color="secondary">
          Monthly revenue
        </Text>
        <Text variant="display" color="primary">
          $48.2k
        </Text>
        <Badge tone="success">+12.5%</Badge>
      </Stack>
    </Card>
  );
}
