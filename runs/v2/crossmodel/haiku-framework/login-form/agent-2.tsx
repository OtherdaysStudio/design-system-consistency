import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Stack, Text, TextField, token } from '@/ds';

/**
 * LoginForm — a sign-in card with consistent spacing and token-driven styling.
 *
 * Reuses registered DS components:
 * - <Card> for the bounded surface
 * - <Stack gap> for vertical layout and spacing
 * - <Text variant> for all typography
 * - <TextField> for email and password inputs
 * - <Button variant> for primary and secondary actions
 *
 * All spacing is token-driven via <Stack gap>. No raw padding/margin literals.
 */

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sign-in
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg">
        {/* Header section */}
        <Stack direction="column" gap="xs">
          <Text variant="title" color="primary">
            Welcome back
          </Text>
          <Text variant="body" color="secondary">
            Sign in to your account to continue
          </Text>
        </Stack>

        {/* Form section */}
        <form onSubmit={handleSubmit}>
          <Stack direction="column" gap="md">
            {/* Email field */}
            <Stack direction="column" gap="xs">
              <Text variant="label" color="primary">
                Email
              </Text>
              <TextField
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Stack>

            {/* Password field */}
            <Stack direction="column" gap="xs">
              <Text variant="label" color="primary">
                Password
              </Text>
              <TextField
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Stack>

            {/* Primary sign-in button — full width */}
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Secondary create account button — full width */}
            <Button
              variant="secondary"
              size="md"
              type="button"
              style={{ width: '100%' }}
            >
              Create account
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
