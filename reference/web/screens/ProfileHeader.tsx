import { Avatar, Badge, Button, Stack, Text } from '@/ds';

// Fixes (review): tighter avatar↔name gap (sm, was md); name/role gap "none";
// Follow pinned right (justify="between"); self-contained default name.
export interface ProfileHeaderProps {
  name?: string;
  avatarSrc?: string;
}

export function ProfileHeader({ name = 'Ada Lovelace', avatarSrc }: ProfileHeaderProps) {
  return (
    <Stack direction="row" gap="sm" align="center" justify="between">
      <Stack direction="row" gap="sm" align="center">
        <Avatar size="lg" name={name} src={avatarSrc} />
        <Stack direction="column" gap="none" align="start">
          <Text variant="title" color="primary">{name}</Text>
          <Stack direction="row" gap="sm" align="center">
            <Text variant="caption" color="secondary">Product Designer</Text>
            <Badge tone="neutral">Pro</Badge>
          </Stack>
        </Stack>
      </Stack>
      <Button variant="primary" size="md">Follow</Button>
    </Stack>
  );
}
export default ProfileHeader;
