import React from 'react';
import { Breadcrumb, Card, Stack, Text } from '@/ds';

/**
 * DocsPageHeader — the top of a documentation page for a single component.
 *
 * Composition only: every value comes from a registered design-system primitive.
 *  - The breadcrumb trail reuses the registered <Breadcrumb> (NOT a hand-rolled
 *    row of <a>/'/' literals) — see its anti-pattern in the manifest.
 *  - All type is set via <Text variant> (heading for the title, body for the
 *    subtitle); spacing is set only via <Stack gap>; the bounded surface comes
 *    from <Card>. No raw hex/px/rem/shadow literals appear anywhere.
 */
export interface DocsPageHeaderProps {
  /** Visible page title and current breadcrumb crumb. */
  title?: string;
  /** One-line description shown beneath the title. */
  subtitle?: string;
}

const TRAIL = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
] as const;

export function DocsPageHeader({
  title = 'Button',
  subtitle = 'Triggers an action — the primary way users commit to a choice.',
}: DocsPageHeaderProps) {
  return (
    <Card variant="default">
      <Stack direction="column" gap="md" align="start">
        {/* Reused: registered Breadcrumb. Current page is the last (link-less) crumb. */}
        <Breadcrumb
          items={[...TRAIL, { label: title }]}
          separator="slash"
          size="sm"
          aria-label="Breadcrumb"
        />

        <Stack direction="column" gap="xs" align="start">
          <Text variant="heading" color="primary">
            {title}
          </Text>
          <Text variant="body" color="secondary">
            {subtitle}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export default DocsPageHeader;
