import React from 'react';
import { Stack, Text, token } from '@/ds';

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbItem {
  /** Visible label for this crumb. */
  label: string;
  /** Optional href. The current (last) item is rendered as plain text regardless. */
  href?: string;
}

export interface BreadcrumbProps {
  /** Ordered list of crumbs, root first, current page last. */
  items: BreadcrumbItem[];
  /** Type scale of the trail. Maps to the matching <Text variant>. */
  size?: BreadcrumbSize;
  /** Glyph drawn between crumbs. */
  separator?: 'chevron' | 'slash';
  /** Accessible label for the wrapping <nav>. */
  'aria-label'?: string;
}

const TEXT_VARIANT_BY_SIZE: Record<BreadcrumbSize, 'caption' | 'label' | 'body'> = {
  sm: 'caption',
  md: 'label',
  lg: 'body',
};

const SEPARATOR_GLYPH: Record<NonNullable<BreadcrumbProps['separator']>, string> = {
  chevron: '›', // ›
  slash: '/',
};

/**
 * Breadcrumb — a horizontal trail of links showing the user's position in a
 * navigational hierarchy. Each ancestor crumb is a link; the final crumb is the
 * current page, rendered as non-link primary text. Built from Stack + Text + tokens only.
 */
export function Breadcrumb({
  items,
  size = 'md',
  separator = 'chevron',
  'aria-label': ariaLabel = 'Breadcrumb',
}: BreadcrumbProps) {
  const textVariant = TEXT_VARIANT_BY_SIZE[size];
  const glyph = SEPARATOR_GLYPH[separator];
  const lastIndex = items.length - 1;

  return (
    <nav aria-label={ariaLabel}>
      <Stack direction="row" gap="xs" align="center">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;
          return (
            <Stack key={`${item.label}-${index}`} direction="row" gap="xs" align="center">
              {isCurrent ? (
                <Text variant={textVariant} color="primary" aria-current="page">
                  {item.label}
                </Text>
              ) : item.href ? (
                <a href={item.href} style={{ textDecoration: 'none', color: token.color.action.primary }}>
                  <Text variant={textVariant} color="secondary">
                    {item.label}
                  </Text>
                </a>
              ) : (
                <Text variant={textVariant} color="secondary">
                  {item.label}
                </Text>
              )}
              {!isCurrent && (
                <Text variant={textVariant} color="muted" aria-hidden>
                  {glyph}
                </Text>
              )}
            </Stack>
          );
        })}
      </Stack>
    </nav>
  );
}

export default Breadcrumb;
