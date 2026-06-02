import { Button, Card, TextField, Text, Stack } from '@/ds';

export function LoginForm() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="xs" align="start">
          <Text variant="title" color="primary">
            Welcome back
          </Text>
          <Text variant="body" color="secondary">
            Sign in to your account to continue.
          </Text>
        </Stack>

        <Stack direction="column" gap="md" align="stretch">
          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="primary">
              Email
            </Text>
            <TextField
              type="email"
              state="default"
              placeholder="you@example.com"
            />
          </Stack>

          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="primary">
              Password
            </Text>
            <TextField
              type="password"
              state="default"
              placeholder="••••••••"
            />
          </Stack>
        </Stack>

        <Stack direction="column" gap="sm" align="stretch">
          <Button variant="primary" size="lg">
            Sign in
          </Button>
          <Button variant="ghost" size="lg">
            Create account
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LoginForm;
