import { Card, Stack, Text, Badge, StatSparkline } from '@/ds';

/**
 * RevenueStat — a revenue stat card.
 *
 * Composition only: every surface, type ramp, spacing step, status pill and
 * trend visual is a REGISTERED component from '@/ds'. Nothing here is
 * hand-rolled.
 *
 *   - Surface           → <Card variant="elevated">   (inset/radius/elevation are the card's)
 *   - Caption           → <Text variant="caption">    (type only via <Text variant>)
 *   - Large value       → <Text variant="display">
 *   - Change badge       → <Badge tone="success">      (NOT a styled <span> pill)
 *   - Inline trend      → <StatSparkline> [NEW]        (NOT a hand-rolled <svg>)
 *   - All spacing        → <Stack gap>                 (no ad-hoc margins)
 *
 * No raw hex / px / rem / shadow literals appear — there are no style props at
 * all; layout and type come entirely from the components' token-driven enums.
 */

/** Recent revenue samples — relative shape only; the sparkline is axis-less. */
const REVENUE_TREND = [38.1, 39.4, 41.0, 40.2, 43.8, 45.6, 48.2];

export function RevenueStat() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="sm" align="start">
        <Text variant="caption" color="muted">
          Monthly revenue
        </Text>

        <Stack direction="row" gap="sm" align="center">
          <Text variant="display" color="primary">
            $48.2k
          </Text>
          <Badge tone="success">+12.5%</Badge>
        </Stack>

        <StatSparkline
          data={REVENUE_TREND}
          size="sm"
          tone="success"
          variant="line"
          label="Monthly revenue up 12.5%"
        />
      </Stack>
    </Card>
  );
}

export default RevenueStat;
