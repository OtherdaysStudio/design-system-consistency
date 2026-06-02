import { Button, Card, TextField, Text, Stack } from '@/ds';

export function LoginForm() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="xs" align="stretch">
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
              state="default"
              type="email"
              name="email"
              placeholder="you@example.com"
            />
          </Stack>

          <Stack direction="column" gap="xs" align="stretch">
            <Text variant="label" color="primary">
              Password
            </Text>
            <TextField
              state="default"
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </Stack>
        </Stack>

        <Stack direction="column" gap="sm" align="stretch">
          <Button variant="primary" size="lg" type="submit">
            Sign in
          </Button>
          <Button variant="ghost" size="lg" type="button">
            Create account
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LoginForm;
