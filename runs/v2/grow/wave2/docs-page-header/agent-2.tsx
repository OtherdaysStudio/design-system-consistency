import React from 'react';
import { Breadcrumb, Badge, Card, Stack, Text } from '@/ds';
import type { BreadcrumbItem } from '@/ds';

/**
 * DocsPageHeader — the header block for a component-reference doc page.
 *
 * Composition only: it reuses registered design-system components and never
 * re-implements them.
 *  - <Breadcrumb> [NEW] renders the full navigational trail (Home / Docs /
 *    Components / Button). We pass it `items`; it owns crumb spacing, the
 *    separator glyph, link/current treatment, and type scale. We do NOT
 *    hand-roll a <nav> of <a> tags joined by a literal '/'.
 *  - <Text variant> is the only way type is set (heading for the title,
 *    body for the subtitle).
 *  - <Stack gap> is the only way vertical/horizontal spacing is expressed —
 *    no ad-hoc margins.
 *  - <Badge> reuses the registered status pill for the component's stability.
 *  - <Card> provides the bounded header surface (inset, radius, elevation).
 * Every visual value flows through a registered component's variant/gap — so
 * there are no raw hex/px/rem/shadow literals and no inline style at all.
 */

export interface DocsPageHeaderProps {
  /**
   * The crumbs from site root to the current page. Defaults to the Button
   * component-reference trail. Root first, current page last; the current
   * page omits `href` so Breadcrumb renders it as the non-link location.
   */
  breadcrumbs?: BreadcrumbItem[];
  /** Page heading — the component being documented. */
  title?: string;
  /** One-line description shown beneath the heading. */
  subtitle?: string;
  /** Stability/status label shown beside the title. Omit to hide. */
  status?: { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' };
}

const DEFAULT_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
  { label: 'Button' },
];

export function DocsPageHeader({
  breadcrumbs = DEFAULT_BREADCRUMBS,
  title = 'Button',
  subtitle = 'Triggers an action. The primary way users commit to a step in a flow.',
  status = { label: 'Stable', tone: 'success' },
}: DocsPageHeaderProps) {
  return (
    <Card variant="default">
      <Stack direction="column" gap="md" align="start">
        {/* Registered Breadcrumb — owns the trail; not re-implemented here. */}
        <Breadcrumb items={breadcrumbs} size="sm" separator="slash" aria-label="Breadcrumb" />

        <Stack direction="column" gap="xs" align="start">
          <Stack direction="row" gap="sm" align="center">
            <Text variant="heading" color="primary" as="h1">
              {title}
            </Text>
            {status ? <Badge tone={status.tone}>{status.label}</Badge> : null}
          </Stack>

          <Text variant="body" color="secondary" as="p">
            {subtitle}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export default DocsPageHeader;
