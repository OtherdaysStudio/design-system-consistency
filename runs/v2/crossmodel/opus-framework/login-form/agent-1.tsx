import { Button, Card, Stack, Text, TextField } from '@/ds';

/**
 * LoginForm — Aperture DS sign-in card.
 *
 * Built per the Design System Consistency framework:
 * - REUSE only registered components from '@/ds' (Card, Stack, Text, TextField,
 *   Button) — nothing hand-rolled.
 * - Typography ONLY via <Text variant> (heading / body / label).
 * - Spacing ONLY via <Stack gap> — the single canonical layout path; no raw
 *   margins, padding, or gap literals anywhere.
 * - Variants are enums (Card variant, Button variant, Text variant, Stack gap).
 * - Full-width buttons come from the Stack's cross-axis `stretch`, not an inline
 *   width literal — so no bare style value escapes the components.
 */
export function LoginForm() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        {/* Header: title + subtitle, tight rhythm */}
        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            Welcome back
          </Text>
          <Text variant="body" color="secondary">
            Sign in to your Aperture account to continue.
          </Text>
        </Stack>

        {/* Fields */}
        <Stack direction="column" gap="md" align="stretch">
          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="primary" as="label">
              Email
            </Text>
            <TextField
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Stack>

          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="primary" as="label">
              Password
            </Text>
            <TextField
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </Stack>
        </Stack>

        {/* Actions: full-width via Stack stretch */}
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
