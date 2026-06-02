import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Card, Stack, Text, Switch, token } from '@/ds';

/**
 * SettingsRow — a list row for settings/preferences with a label, helper text,
 * and a right-aligned control (e.g., toggle, button). Built on Card surface
 * with consistent padding and spacing via Stack.
 *
 * Common use: settings toggles, preference switches, activity notifications.
 */

export interface SettingsRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Optional supporting text below the label. */
  helperText?: ReactNode;
  /** Right-aligned control (switch, button, etc.). */
  control?: ReactNode;
  /** Card variant (default or elevated). */
  variant?: 'default' | 'elevated';
  children?: never;
}

export const SettingsRow = forwardRef<HTMLDivElement, SettingsRowProps>(function SettingsRow(
  { label, helperText, control, variant = 'default', className, style, ...rest },
  ref,
) {
  const containerStyle: CSSProperties = {
    // Card surface already applies padding via token.card.padding;
    // this is the inner flex row that aligns label+helper on left,
    // control on right.
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: token.space.md,
    ...style,
  };

  return (
    <Card ref={ref} variant={variant} className={className} {...rest}>
      <div style={containerStyle}>
        {/* Left side: label + helper text stacked vertically */}
        <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
          {/* Label: primary text, semibold via type.label */}
          <Text variant="label" color="primary">
            {label}
          </Text>
          {/* Helper text: secondary color, smaller via type.caption */}
          {helperText && (
            <Text variant="caption" color="secondary">
              {helperText}
            </Text>
          )}
        </Stack>
        {/* Right side: control, right-aligned */}
        {control && <div>{control}</div>}
      </div>
    </Card>
  );
});

SettingsRow.displayName = 'SettingsRow';
