import { Button, Card, Stack, Text, TextField } from '@/ds';

/**
 * LoginForm — Aperture DS sign-in card.
 *
 * Built under the Design System Consistency framework:
 * - REUSE only: Card, Stack, Text, TextField, Button from '@/ds' (no hand-rolled
 *   <div>/<button>/<input>/<span>).
 * - Typography is set ONLY via <Text variant> (never inline font-size/weight).
 * - All spacing flows through <Stack gap> (spacing-token enum) — no raw margins.
 * - Variants are enums (Card variant, Text variant/color, Button variant/size,
 *   TextField state).
 * - Each button is full-width via the canonical layout path: a column Stack
 *   with align="stretch" makes its child fill the cross axis — no inline width
 *   literal, no raw style values.
 */
export function LoginForm() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        {/* Header: title + subtitle, tightly grouped */}
        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            Welcome back
          </Text>
          <Text variant="body" color="secondary">
            Sign in to your Aperture account to continue.
          </Text>
        </Stack>

        {/* Fields: each label + input grouped, fields evenly spaced */}
        <Stack direction="column" gap="md" align="stretch">
          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="secondary" as="label">
              Email
            </Text>
            <TextField
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              state="default"
            />
          </Stack>

          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="secondary" as="label">
              Password
            </Text>
            <TextField
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              state="default"
            />
          </Stack>
        </Stack>

        {/* Actions: full-width primary + secondary, stretched to card width */}
        <Stack direction="column" gap="sm" align="stretch">
          <Button variant="primary" size="lg" type="submit">
            Sign in
          </Button>
          <Button variant="secondary" size="lg" type="button">
            Create account
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LoginForm;
