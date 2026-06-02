import { Button, Card, TextField, Text, Stack } from '@/ds';

export function LoginForm() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">Welcome back</Text>
          <Text variant="body" color="secondary">Sign in to your Aperture account</Text>
        </Stack>
        <Stack direction="column" gap="md" align="stretch">
          <TextField state="default" />
          <TextField state="default" />
        </Stack>
        <Stack direction="column" gap="sm" align="stretch">
          <Button variant="primary" size="lg">Sign in</Button>
          <Button variant="secondary" size="lg">Create account</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LoginForm;
