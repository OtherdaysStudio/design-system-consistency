import { Card, Stack, Text, Avatar, Badge, Button } from '@/ds';

const PEOPLE = [
  { name: 'Ada Lovelace', role: 'Product Designer', tag: 'Admin', tone: 'info' as const },
  { name: 'Alan Turing', role: 'Engineering Lead', tag: 'Owner', tone: 'neutral' as const },
  { name: 'Grace Hopper', role: 'Data Science', tag: null, tone: 'neutral' as const },
];

export function TeamList() {
  return (
    <Card padding="sm">
      <Stack direction="column" gap="md" align="stretch">
        <Text variant="title">Team</Text>
        <Stack direction="column" gap="md" align="stretch">
          {PEOPLE.map((p) => (
            <Stack key={p.name} direction="row" gap="sm" align="center" justify="between">
              <Stack direction="row" gap="sm" align="center">
                <Avatar size="md" name={p.name} />
                <Stack direction="column" gap="none" align="start">
                  <Stack direction="row" gap="sm" align="center">
                    <Text variant="label">{p.name}</Text>
                    {p.tag && <Badge tone={p.tone}>{p.tag}</Badge>}
                  </Stack>
                  <Text variant="caption" color="secondary">{p.role}</Text>
                </Stack>
              </Stack>
              <Button variant="ghost" size="sm">Manage</Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
export default TeamList;
