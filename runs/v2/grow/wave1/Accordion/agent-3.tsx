import { forwardRef, useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Stack, Text, token } from '@/ds';

/**
 * Accordion — a single collapsible section. A header row (title Text + chevron)
 * toggles a body region. Surface background, token-driven spacing/border/radius.
 *
 * size: sm | md | lg  (controls header/body inset density)
 *
 * For a one-off "show/hide" with no persistent surface, this is still the
 * sanctioned path — never hand-roll a <div> with onClick + inline padding.
 * NOT a tab strip and NOT a modal: use those components for mutually-exclusive
 * panels or focus-trapping overlays respectively.
 */

export type AccordionSize = 'sm' | 'md' | 'lg';

/** Inset density per size — derived from on-scale spacing tokens (no raw px). */
const PADDING: Record<AccordionSize, string> = {
  sm: token.space.sm,
  md: token.space.md,
  lg: token.space.lg,
};

export interface AccordionProps {
  /** Header label shown in the row. */
  title: ReactNode;
  /** Body region revealed when open. */
  children?: ReactNode;
  size?: AccordionSize;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Chevron glyph that rotates to reflect open/closed state. */
function Chevron({ open }: { open: boolean }) {
  const style: CSSProperties = {
    display: 'inline-flex',
    width: token.size.icon.sm,
    height: token.size.icon.sm,
    color: token.color.text.secondary,
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `transform ${token.duration.fast} ${token.easing.standard}`,
    flexShrink: 0,
  };
  return (
    <span aria-hidden style={style}>
      <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    title,
    children,
    size = 'md',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    style,
  },
  ref,
) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const headingId = useId();
  const regionId = useId();
  const pad = PADDING[size];

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setOpenState((v) => !v);
    onOpenChange?.(!open);
  };

  const containerStyle: CSSProperties = {
    background: token.color.bg.surface,
    border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
    borderRadius: token.radius.md,
    overflow: 'hidden',
    ...style,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: token.space.sm,
    padding: pad,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const bodyStyle: CSSProperties = {
    padding: pad,
    borderTop: `${token.borderWidth.thin} solid ${token.color.border.default}`,
  };

  return (
    <div ref={ref} className={className} style={containerStyle}>
      <button
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={regionId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={toggle}
        style={headerStyle}
      >
        <Text variant="title" color="primary">
          {title}
        </Text>
        <Chevron open={open} />
      </button>
      <div id={regionId} role="region" aria-labelledby={headingId} hidden={!open}>
        {open ? (
          <div style={bodyStyle}>
            <Stack direction="column" gap="sm" align="stretch">
              {children}
            </Stack>
          </div>
        ) : null}
      </div>
    </div>
  );
});

Accordion.displayName = 'Accordion';
