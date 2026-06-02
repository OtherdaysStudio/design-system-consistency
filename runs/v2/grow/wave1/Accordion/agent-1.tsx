import { forwardRef, useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { token, Stack, Text } from '@/ds';

/**
 * Accordion — a single collapsible disclosure section. A header row (title
 * Text + chevron) toggles a body region below it. Use for progressively
 * revealing one optional block of content (FAQ item, advanced settings,
 * collapsible detail).
 *
 * NOT for primary navigation, NOT a tab set, and NOT a modal/sheet — those have
 * their own components. For a static grouping surface that never collapses, use
 * <Card> instead.
 *
 * size: sm | md | lg  — controls header inset density (token spacing only).
 *
 * Surface background, border, radius and spacing all come from tokens. Title
 * type is set only via <Text variant>; layout only via <Stack gap>. Never
 * hand-roll a <div> + onClick with inline padding/border to fake this.
 */

export type AccordionSize = 'sm' | 'md' | 'lg';

interface AccordionDensity {
  /** Inset around the header row and body. */
  pad: string;
  /** Title typography preset. */
  titleVariant: 'label' | 'title' | 'heading';
}

// Density is derived purely from on-scale spacing tokens + registered type presets.
const DENSITY: Record<AccordionSize, AccordionDensity> = {
  sm: { pad: token.space.sm, titleVariant: 'label' },
  md: { pad: token.space.md, titleVariant: 'title' },
  lg: { pad: token.space.lg, titleVariant: 'heading' },
};

export interface AccordionProps {
  /** Header label shown in the title row. */
  title: ReactNode;
  /** Collapsible body content. */
  children?: ReactNode;
  size?: AccordionSize;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { title, children, size = 'md', defaultOpen = false, open, onOpenChange, className, style },
  ref,
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const d = DENSITY[size];
  const bodyId = useId();
  const headerId = useId();

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const rootStyle: CSSProperties = {
    background: token.color.bg.surface,
    border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
    borderRadius: token.radius.md,
    overflow: 'hidden',
    ...style,
  };

  const headerStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: d.pad,
    margin: 0,
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    transition: `background ${token.duration.fast} ${token.easing.standard}`,
  };

  const chevronStyle: CSSProperties = {
    width: token.size.icon.sm,
    height: token.size.icon.sm,
    flexShrink: 0,
    color: token.color.text.secondary,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `transform ${token.duration.base} ${token.easing.standard}`,
  };

  const bodyStyle: CSSProperties = {
    padding: d.pad,
    borderTop: `${token.borderWidth.thin} solid ${token.color.border.default}`,
  };

  return (
    <div ref={ref} className={className} style={rootStyle}>
      <button
        id={headerId}
        type="button"
        style={headerStyle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        onClick={toggle}
      >
        <Stack direction="row" gap="sm" align="center">
          <Text variant={d.titleVariant} color="primary" style={{ flex: 1 }}>
            {title}
          </Text>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={chevronStyle}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Stack>
      </button>
      {isOpen && (
        <div id={bodyId} role="region" aria-labelledby={headerId} style={bodyStyle}>
          <Text variant="body" color="secondary">
            {children}
          </Text>
        </div>
      )}
    </div>
  );
});

Accordion.displayName = 'Accordion';
