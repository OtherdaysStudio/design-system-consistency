import { forwardRef, Fragment } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Stack, Text, token } from '@/ds';
import type { TextVariant } from '@/ds';

/**
 * Breadcrumb — a trail of navigational links showing the user's position in a
 * content hierarchy (path navigation). Each ancestor is a link; the last item
 * is the current page, rendered as non-link primary text. Separators are a
 * muted chevron between items.
 *
 * size: sm | md | lg  (maps to the registered <Text> type presets)
 *
 * NOT a tab bar, a menu, or a generic horizontal link row — use Breadcrumb only
 * to express location within a hierarchy. Composed from Stack + Text + tokens;
 * never hand-roll a <nav> of inline-styled <a>/<span> with raw gap/color.
 */

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbItem {
  /** Visible label for this crumb. */
  label: string;
  /** Destination for ancestor crumbs. Omit for the current (last) crumb. */
  href?: string;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Ordered crumbs from root to current. The last item is treated as current. */
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  /** Separator rendered between crumbs. Defaults to a muted chevron. */
  separator?: ReactNode;
  /** Invoked when an ancestor crumb is activated. */
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
}

/** Map the canonical size enum onto registered <Text> typography variants. */
const SIZE_TEXT_VARIANT: Record<BreadcrumbSize, TextVariant> = {
  sm: 'caption',
  md: 'label',
  lg: 'body',
};

const LINK_STYLE: CSSProperties = {
  textDecoration: 'none',
  cursor: 'pointer',
};

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, size = 'md', separator, onNavigate, ...rest },
  ref,
) {
  const textVariant = SIZE_TEXT_VARIANT[size];
  const sep = separator ?? (
    <Text variant={textVariant} color="muted" aria-hidden style={{ userSelect: 'none' }}>
      {'›'}
    </Text>
  );

  return (
    <nav ref={ref} aria-label="Breadcrumb" {...rest}>
      <Stack direction="row" gap="xs" align="center" wrap>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          const crumb = isCurrent ? (
            <Text variant={textVariant} color="primary" aria-current="page">
              {item.label}
            </Text>
          ) : (
            <Text
              as="a"
              variant={textVariant}
              color="secondary"
              href={item.href}
              style={LINK_STYLE}
              onClick={() => onNavigate?.(item, index)}
            >
              {item.label}
            </Text>
          );

          return (
            <Fragment key={index}>
              {index > 0 ? sep : null}
              {crumb}
            </Fragment>
          );
        })}
      </Stack>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
