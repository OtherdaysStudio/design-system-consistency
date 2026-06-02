import { Avatar, Badge, Button, Stack, Text } from '@/ds';

export function ProfileHeader() {
  return (
    <Stack direction="row" align="center" gap="md">
      <Avatar size="lg" />
      <Stack direction="column" gap="xs">
        <Text variant="title" color="primary">
          Jordan Rivera
        </Text>
        <Stack direction="row" align="center" gap="sm">
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
