import { Card, Stack, Text, Badge, Button } from '@/ds';

const TIERS = [
  { name: 'Starter', price: '$0', sub: 'For trying things out', tone: null, cta: 'secondary' as const, features: ['1 project', 'Community support'] },
  { name: 'Pro', price: '$29', sub: 'For growing teams', tone: 'info' as const, cta: 'primary' as const, features: ['Unlimited projects', 'Priority support', 'Advanced analytics'] },
  { name: 'Scale', price: '$99', sub: 'For organizations', tone: null, cta: 'secondary' as const, features: ['SSO + SAML', 'Audit logs', 'Dedicated manager'] },
];

export function PricingTiers() {
  return (
    <Stack direction="row" gap="md" align="stretch" wrap>
      {TIERS.map((t, i) => (
        <Card key={t.name} variant={t.tone ? 'elevated' : 'default'} className={`ds-enter ds-enter-${i + 1}`} style={{ flex: '1 1 220px' }}>
          <Stack direction="column" gap="lg" align="stretch">
            <Stack direction="row" gap="sm" align="center" justify="between">
              <Text variant="title">{t.name}</Text>
              {t.tone && <Badge tone={t.tone}>Most popular</Badge>}
            </Stack>
            <Stack direction="row" gap="xs" align="baseline">
              <Text variant="hero">{t.price}</Text>
              <Text variant="caption" color="muted">/mo</Text>
            </Stack>
            <Text variant="caption" color="secondary">{t.sub}</Text>
            <Stack direction="column" gap="sm" align="stretch">
              {t.features.map((f) => (
                <Stack key={f} direction="row" gap="sm" align="center">
                  <Text variant="label" color="secondary">✓</Text>
                  <Text variant="body">{f}</Text>
                </Stack>
              ))}
            </Stack>
            <Button variant={t.cta} size="lg">Choose {t.name}</Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
export default PricingTiers;
