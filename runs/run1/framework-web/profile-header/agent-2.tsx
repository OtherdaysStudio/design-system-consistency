import { Avatar, Badge, Button, Stack, Text } from '@/ds';

export function ProfileHeader() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar size="lg" />
      <Stack direction="column" gap="xs" align="start">
        <Text variant="title" color="primary">
          Jordan Avery
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
