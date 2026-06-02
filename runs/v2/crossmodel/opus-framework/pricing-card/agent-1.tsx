import { Card, Badge, Text, Stack, Button, token } from '@/ds';

/**
 * PricingCard — the "Pro" tier pricing card.
 *
 * Built per the Design System Consistency framework (Mode B — govern new code):
 * every element routes through its most specific registered '@/ds' component,
 * type is set ONLY via <Text variant>, all spacing flows through <Stack gap>,
 * and the lone non-component style value (the divider color/width) references
 * token.* — never a raw literal.
 *
 * Reuse vs create: 100% reuse. Card (elevated surface), Badge (status pill),
 * Text (all typography), Stack (all layout/spacing), Button (CTA). Nothing
 * hand-rolled, no new registry entries required.
 */

const FEATURES = [
  'Unlimited projects & exports',
  'Priority rendering queue',
  'Advanced collaboration tools',
] as const;

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        {/* Status pill — most specific component for an inline status label. */}
        <Stack direction="row" gap="none" align="start">
          <Badge tone="info">Most popular</Badge>
        </Stack>

        {/* Tier name + one-line description. */}
        <Stack direction="column" gap="xs" align="stretch">
          <Text variant="heading" color="primary">
            Pro
          </Text>
          <Text variant="body" color="secondary">
            Everything you need to ship faster, solo or with your team.
          </Text>
        </Stack>

        {/* Price + per-month caption, baseline-aligned. */}
        <Stack direction="row" gap="xs" align="end">
          <Text variant="display" color="primary">
            $29
          </Text>
          <Text variant="caption" color="muted">
            /mo
          </Text>
        </Stack>

        {/* Feature lines. */}
        <Stack
          direction="column"
          gap="sm"
          align="stretch"
          style={{
            borderTop: `${token.borderWidth.thin} solid ${token.color.border.default}`,
            paddingTop: token.space.lg,
          }}
        >
          {FEATURES.map((feature) => (
            <Stack key={feature} direction="row" gap="sm" align="center">
              <Text variant="label" color="secondary" aria-hidden="true">
                ✓
              </Text>
              <Text variant="body" color="primary">
                {feature}
              </Text>
            </Stack>
          ))}
        </Stack>

        {/* Full-width primary CTA — the parent Stack's align="stretch" makes the
            Button span the card; width is owned by layout, not a raw literal. */}
        <Button variant="primary" size="lg">
          Get started
        </Button>
      </Stack>
    </Card>
  );
}

export default PricingCard;
