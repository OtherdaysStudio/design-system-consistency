import { Breadcrumb, Card, Stack, Text } from '@/ds';

/**
 * DocsPageHeader — the header block for a component documentation page.
 *
 * Composition (reused registered components only, imported from '@/ds'):
 *  - <Breadcrumb> [NEW]  the navigational trail Home / Docs / Components / Button.
 *    The registered Breadcrumb is REUSED — never hand-rolled as <a>/<span> + '/'.
 *  - <Text variant="heading">  the page title.
 *  - <Text variant="body" color="secondary">  the one-line subtitle.
 *  - <Card> + <Stack gap>  the bounding surface and the only spacing mechanism.
 *
 * Rules honored:
 *  - Type is set ONLY via <Text variant>; spacing ONLY via <Stack gap>.
 *  - No raw hex/px/rem/shadow literals — every styled value is encoded by a
 *    registered component (Card surface tokens, Text type presets, Stack gap tokens).
 */

const TRAIL = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
  { label: 'Button' },
] as const;

export function DocsPageHeader() {
  return (
    <Card variant="default">
      <Stack direction="column" gap="md" align="start">
        <Breadcrumb items={[...TRAIL]} size="sm" separator="slash" />
        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            Button
          </Text>
          <Text variant="body" color="secondary">
            Triggers an action — use it whenever a user needs to commit, confirm, or proceed.
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export default DocsPageHeader;
