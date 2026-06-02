import { Card, Stack, Text, Badge, Button } from '@/ds';

const TOASTS = [
  { tone: 'success' as const, title: 'Saved', body: 'Your changes were published.', action: 'Undo' },
  { tone: 'warning' as const, title: 'Storage almost full', body: '92% of your plan used.', action: 'Upgrade' },
  { tone: 'danger' as const, title: 'Sync failed', body: "Couldn't reach the server.", action: 'Retry' },
];

export function ToastStack() {
  return (
    <Stack direction="column" gap="sm" align="stretch">
      {TOASTS.map((t) => (
        <Card key={t.title} variant="elevated" padding="sm">
          <Stack direction="row" gap="md" align="center" justify="between">
            <Stack direction="row" gap="sm" align="center">
              <Badge tone={t.tone} dot />
              <Stack direction="column" gap="none" align="start">
                <Text variant="label">{t.title}</Text>
                <Text variant="caption" color="secondary">{t.body}</Text>
              </Stack>
            </Stack>
            <Button variant="secondary" size="sm">{t.action}</Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
export default ToastStack;
