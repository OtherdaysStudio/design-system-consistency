import { forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { token } from './tokens';

/**
 * Text — the ONLY sanctioned way to set typography in Aperture DS.
 *
 * `variant` maps 1:1 to a registered `.type-*` preset (type.display … type.caption).
 * `color` selects a semantic text color token. Never set font-size / weight /
 * line-height inline — that fragments the type scale (manifest anti-pattern).
 */

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'label'
  | 'caption';

export type TextColor = 'primary' | 'secondary' | 'muted' | 'onAction';

const TYPE_CLASS: Record<TextVariant, string> = {
  display: 'type-display',
  heading: 'type-heading',
  title: 'type-title',
  body: 'type-body',
  label: 'type-label',
  caption: 'type-caption',
};

const COLOR_TOKEN: Record<TextColor, string> = {
  primary: token.color.text.primary,
  secondary: token.color.text.secondary,
  muted: token.color.text.muted,
  onAction: token.color.text.onAction,
};

/** Sensible default semantic element per typographic variant. */
const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: 'h1',
  heading: 'h2',
  title: 'h3',
  body: 'p',
  label: 'span',
  caption: 'span',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  /** Override the rendered element (defaults to a sensible tag per variant). */
  as?: ElementType;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', color = 'primary', as, className, style, children, ...rest },
  ref,
) {
  const Component = (as ?? DEFAULT_TAG[variant]) as ElementType;
  const mergedStyle: CSSProperties = { color: COLOR_TOKEN[color], margin: 0, ...style };
  const mergedClass = [TYPE_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <Component ref={ref} className={mergedClass} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';
