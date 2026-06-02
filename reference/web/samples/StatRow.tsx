import { Card, Stack, Text, Badge } from '@/ds';

const STATS = [
  { label: 'Monthly revenue', value: '$48.2k', delta: '+12.5%', tone: 'success' as const },
  { label: 'Active users', value: '1,284', delta: '+3.1%', tone: 'success' as const },
  { label: 'Churn', value: '2.4%', delta: '-0.6%', tone: 'danger' as const },
];

export function StatRow() {
  return (
    <Stack direction="row" gap="md" align="stretch" wrap>
      {STATS.map((s, i) => (
        <Card key={s.label} className={`ds-enter ds-enter-${i + 1}`} style={{ flex: '1 1 200px' }}>
          <Stack direction="column" gap="sm" align="start">
            <Text variant="caption" color="secondary">{s.label}</Text>
            <Stack direction="row" gap="sm" align="center">
              <Text variant="hero">{s.value}</Text>
              <Badge tone={s.tone}>{s.delta}</Badge>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
export default StatRow;
