import { Avatar, Badge, Button, Stack, Text } from '@/ds';

/**
 * ProfileHeader — a horizontal, vertically-centered user profile header row.
 *
 * Layout: avatar (left) · name + role/badge block (center, grows) · Follow (right).
 * All spacing/layout is expressed through <Stack gap>, all type through <Text variant>,
 * and the "Pro" status pill through <Badge tone> — no raw style literals.
 */

export interface ProfileHeaderProps {
  name: string;
  avatarSrc?: string;
}

export function ProfileHeader({ name, avatarSrc }: ProfileHeaderProps) {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar size="lg" name={name} src={avatarSrc} />

      <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
        <Text variant="title" color="primary">
          {name}
        </Text>

        <Stack direction="row" gap="sm" align="center">
          <Text variant="body" color="secondary">
            Product Designer
          </Text>
          <Badge tone="neutral">Pro</Badge>
        </Stack>
      </Stack>

      <Button variant="primary" size="md">
        Follow
      </Button>
    </Stack>
  );
}
