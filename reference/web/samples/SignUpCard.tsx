import { Card, Stack, Text, TextField, Button } from '@/ds';

export function SignUpCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading">Create your account</Text>
          <Text variant="body" color="secondary">Start your 14-day free trial.</Text>
        </Stack>
        <Stack direction="column" gap="md" align="stretch">
          <TextField label="Work email" placeholder="you@company.com" />
          <TextField label="Password" type="password" placeholder="At least 8 characters" />
        </Stack>
        <Button variant="primary" size="lg">Create account</Button>
        <Text variant="caption" color="muted">By continuing you agree to the Terms and Privacy Policy.</Text>
      </Stack>
    </Card>
  );
}
export default SignUpCard;
