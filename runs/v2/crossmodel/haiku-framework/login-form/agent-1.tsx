'use client';

import {
  Button,
  Card,
  TextField,
  Text,
  Stack,
} from '@/ds';
import { token } from '@/ds';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSignIn = () => {
    const emailValid = email.length > 0;
    const passwordValid = password.length > 0;

    setEmailError(!emailValid);
    setPasswordError(!passwordValid);

    if (emailValid && passwordValid) {
      // Handle sign-in logic
    }
  };

  return (
    <Card variant="default" style={{ maxWidth: token.size.control.lg }}>
      <Stack direction="column" gap="md">
        <Stack direction="column" gap="xs">
          <Text variant="heading" color="primary">
            Welcome back
          </Text>
          <Text variant="body" color="secondary">
            Sign in to your account to continue
          </Text>
        </Stack>

        <Stack direction="column" gap="sm">
          <TextField
            state={emailError ? 'error' : 'default'}
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              setEmailError(false);
            }}
          />
          <TextField
            state={passwordError ? 'error' : 'default'}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              setPasswordError(false);
            }}
          />
        </Stack>

        <Stack direction="column" gap="sm">
          <Button variant="primary" size="md" onClick={handleSignIn}>
            Sign in
          </Button>
          <Button variant="secondary" size="md">
            Create account
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
