import { forwardRef, useCallback, useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Stack, Text, token } from '@/ds';

/**
 * Accordion — a single collapsible section: a header row (title + chevron) that
 * toggles a body region open/closed. Surface background, token border + radius,
 * token spacing throughout.
 *
 * size:    sm | md | lg   (drives the header/body inset via spacing tokens)
 *
 * Composes the registered primitives (<Stack>, <Text>) rather than re-styling
 * raw <div>/<span>. Use for ONE disclosure section; for a set of mutually
 * exclusive sections, render several <Accordion>s in a <Stack> — do not
 * hand-roll a custom expand/collapse with inline padding/border/transition.
 *
 * Accessible by construction: the header is a real <button> with aria-expanded
 * + aria-controls, the body is a region labelled by the header.
 */

export type AccordionSize = 'sm' | 'md' | 'lg';

/** Inset for the header/body, expressed only through spacing-token enums. */
const INSET: Record<AccordionSize, { padX: string; padY: string; gap: 'sm' | 'md' }> = {
  sm: { padX: token.space.sm, padY: token.space.sm, gap: 'sm' },
  md: { padX: token.space.md, padY: token.space.md, gap: 'md' },
  lg: { padX: token.space.lg, padY: token.space.md, gap: 'md' },
};

const ICON_SIZE: Record<AccordionSize, string> = {
  sm: token.size.icon.sm,
  md: token.size.icon.md,
  lg: token.size.icon.md,
};

export interface AccordionProps {
  /** Header label shown in the title row. */
  title: ReactNode;
  /** Collapsible body content, revealed when open. */
  children?: ReactNode;
  size?: AccordionSize;
  /** Uncontrolled initial open state. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    title,
    children,
    size = 'md',
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    disabled = false,
    id,
    className,
    style,
  },
  ref,
) {
  const reactId = useId();
  const headerId = `${id ?? reactId}-header`;
  const bodyId = `${id ?? reactId}-body`;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [disabled, open, isControlled, onOpenChange]);

  const inset = INSET[size];

  const containerStyle: CSSProperties = {
    background: token.color.bg.surface,
    border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
    borderRadius: token.radius.md,
    overflow: 'hidden',
    ...style,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: inset.padY,
    paddingBottom: inset.padY,
    paddingLeft: inset.padX,
    paddingRight: inset.padX,
    gap: token.space.sm,
    background: 'transparent',
    border: 'none',
    borderRadius: token.radius.md,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const chevronStyle: CSSProperties = {
    width: ICON_SIZE[size],
    height: ICON_SIZE[size],
    flexShrink: 0,
    color: token.color.text.secondary,
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `transform ${token.duration.fast} ${token.easing.standard}`,
  };

  const bodyStyle: CSSProperties = {
    paddingTop: token.space.none,
    paddingBottom: inset.padY,
    paddingLeft: inset.padX,
    paddingRight: inset.padX,
    borderTop: `${token.borderWidth.thin} solid ${token.color.border.default}`,
  };

  return (
    <div ref={ref} id={id} className={className} style={containerStyle}>
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={bodyId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={toggle}
        style={headerStyle}
      >
        <Text variant="title" color="primary" as="span">
          {title}
        </Text>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={chevronStyle}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        id={bodyId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        style={bodyStyle}
      >
        <Stack direction="column" gap={inset.gap} align="stretch">
          {typeof children === 'string' ? (
            <Text variant="body" color="secondary">
              {children}
            </Text>
          ) : (
            children
          )}
        </Stack>
      </div>
    </div>
  );
});

Accordion.displayName = 'Accordion';
