import { forwardRef, Fragment } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Stack, Text } from '@/ds';

/**
 * Breadcrumb — a horizontal trail showing the user's position in a content
 * hierarchy: a row of <Text> links separated by a muted divider, with the
 * last item rendered as the current (non-link) location.
 *
 * size:      sm | md | lg     (maps to a registered <Text> typographic preset)
 * separator: chevron | slash  (the muted glyph between crumbs)
 *
 * Use for path/hierarchy navigation only. NOT a tab bar, NOT a primary nav
 * menu, and NOT a stepper/progress indicator. Each non-current crumb is a
 * link (text.secondary); the trailing current crumb is non-interactive
 * (text.primary). Spacing comes from <Stack gap>, type from <Text variant>,
 * colors from <Text color> — never raw literals.
 */

export type BreadcrumbSize = 'sm' | 'md' | 'lg';
export type BreadcrumbSeparator = 'chevron' | 'slash';

export interface BreadcrumbItem {
  /** Visible crumb label. */
  label: ReactNode;
  /** Destination; omitted/last item renders as the current, non-link location. */
  href?: string;
}

/** Each size maps 1:1 to a registered Text variant — no free font sizes. */
const SIZE_VARIANT: Record<BreadcrumbSize, 'caption' | 'label' | 'body'> = {
  sm: 'caption',
  md: 'label',
  lg: 'body',
};

/** Gap between crumbs and separators, expressed only as a Stack gap token. */
const SIZE_GAP: Record<BreadcrumbSize, 'xs' | 'sm'> = {
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
};

const SEPARATOR_GLYPH: Record<BreadcrumbSeparator, string> = {
  chevron: '›', // ›
  slash: '/',
};

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  separator?: BreadcrumbSeparator;
}

/** Links inherit color from <Text color="secondary">; strip default underline/color. */
const LINK_RESET: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
};

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, size = 'md', separator = 'chevron', 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  const variant = SIZE_VARIANT[size];
  const gap = SIZE_GAP[size];
  const glyph = SEPARATOR_GLYPH[separator];
  const lastIndex = items.length - 1;

  return (
    <nav ref={ref} aria-label={ariaLabel} {...rest}>
      <Stack direction="row" gap={gap} align="center" wrap>
        {items.map((item, i) => {
          const isCurrent = i === lastIndex || item.href == null;

          const crumb = isCurrent ? (
            <Text variant={variant} color="primary" as="span" aria-current="page">
              {item.label}
            </Text>
          ) : (
            <Text variant={variant} color="secondary" as="a" href={item.href} style={LINK_RESET}>
              {item.label}
            </Text>
          );

          return (
            <Fragment key={i}>
              {crumb}
              {i < lastIndex && (
                <Text variant={variant} color="muted" as="span" aria-hidden="true">
                  {glyph}
                </Text>
              )}
            </Fragment>
          );
        })}
      </Stack>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
