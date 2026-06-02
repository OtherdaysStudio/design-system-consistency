import { Badge, Card, Stack, StatSparkline, Text } from '@/ds';

/**
 * RevenueStat — a revenue stat card.
 *
 * Composition only: every value comes from a registered DS component.
 *  - Surface ........ <Card>            (token inset / radius / elevation)
 *  - Caption ........ <Text variant="caption">  ("Monthly revenue")
 *  - Big figure ..... <Text variant="display">  ("$48.2k")
 *  - Delta pill ..... <Badge tone="success">    ("+12.5%")
 *  - Trend .......... <StatSparkline>            (registered, NOT hand-rolled)
 *
 * Spacing is expressed ONLY through <Stack gap>; type ONLY through <Text variant>.
 * No raw hex / px / rem / shadow literals appear anywhere.
 */

/** Last seven periods of revenue — only the relative shape feeds the sparkline. */
const TREND = [31, 34, 33, 38, 41, 44, 48.2];

export function RevenueStat() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="sm" align="start">
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
            label="Monthly revenue up 12.5% over the last seven periods"
          />
        </Stack>
      </Stack>
    </Card>
  );
}

export default RevenueStat;
