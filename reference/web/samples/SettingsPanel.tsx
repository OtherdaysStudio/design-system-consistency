import { Card, Stack, Text, Switch, Button } from '@/ds';

const ROWS = [
  { title: 'Push notifications', help: 'Get notified about activity', control: 'switch', on: true },
  { title: 'Weekly digest', help: 'A summary every Monday', control: 'switch', on: false },
  { title: 'Two-factor auth', help: 'Extra security on sign-in', control: 'button' },
];

export function SettingsPanel() {
  return (
    <Card padding="sm">
      <Stack direction="column" gap="none" align="stretch">
        {ROWS.map((r, i) => (
          <Stack key={r.title} direction="column" gap="none" align="stretch">
            {i > 0 && <div style={{ height: 1, background: 'var(--color-border-default)', margin: 'var(--space-sm) 0' }} />}
            <Stack direction="row" justify="between" align="center" style={{ paddingTop: 'var(--space-sm)', paddingBottom: 'var(--space-sm)' }}>
              <Stack direction="column" gap="none" align="start">
                <Text variant="label">{r.title}</Text>
                <Text variant="caption" color="secondary">{r.help}</Text>
              </Stack>
              {r.control === 'switch' ? <Switch size="md" checked={r.on} /> : <Button variant="secondary" size="sm">Enable</Button>}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
export default SettingsPanel;
