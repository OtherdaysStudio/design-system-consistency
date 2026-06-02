import { Badge, Card, Stack, StatSparkline, Text } from '@/ds';

/**
 * RevenueStat — a compact revenue KPI card.
 *
 * Layout:
 *   caption  'Monthly revenue'
 *   value    '$48.2k'                          (large)
 *   badge    '+12.5%'  +  inline trend sparkline
 *
 * Composition only — every element is a registered DS component, so all
 * type, spacing, color, radius, and elevation come from token.* via the
 * components themselves. There are no raw hex / px / rem / shadow literals.
 *
 *  - <Card variant="elevated">         bounded surface for the stat group.
 *  - <Text variant=...>                ALL type (caption / display / body).
 *  - <Stack gap=... align=...>         ALL spacing + alignment.
 *  - <Badge tone="success">            the +12.5% delta pill.
 *  - <StatSparkline>                   the registered inline trend chart —
 *                                      NOT a hand-rolled <svg>. tone="success"
 *                                      / variant="line" matches the upward,
 *                                      positive delta.
 */

/** Relative-shape trend samples (direction only; the sparkline draws no axis). */
const TREND: number[] = [38.1, 39.4, 41.0, 40.2, 43.6, 45.9, 48.2];

export function RevenueStat() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="xs" align="start">
        <Text variant="caption" color="muted">
          Monthly revenue
        </Text>
        <Text variant="display" color="primary">
          $48.2k
        </Text>
        <Stack direction="row" gap="sm" align="center">
          <Badge tone="success">+12.5%</Badge>
          <StatSparkline
            data={TREND}
            size="sm"
            tone="success"
            variant="line"
            label="Monthly revenue up 12.5% over the last 7 periods"
          />
        </Stack>
      </Stack>
    </Card>
  );
}
