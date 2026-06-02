import { forwardRef, useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import { token } from './tokens';

/**
 * TextField — a single-line text input with consistent height, radius, border,
 * and a token-driven focus ring (color.border.focus).
 *
 * state: default | error | disabled
 *
 * The `disabled` state is also driven by the native `disabled` prop. Never
 * hand-roll an <input> with inline height/border/padding.
 */

export type TextFieldState = 'default' | 'error' | 'disabled';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  state?: TextFieldState;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { state = 'default', disabled, className, style, onFocus, onBlur, ...rest },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const isDisabled = disabled ?? state === 'disabled';
    const isError = state === 'error';

    // Border priority: focus ring > error > default.
    const borderColor = focused
      ? token.color.border.focus
      : isError
        ? token.color.status.danger
        : token.color.border.default;

    const baseStyle: CSSProperties = {
      boxSizing: 'border-box',
      width: '100%',
      height: token.input.height,
      paddingInline: token.input.paddingX,
      borderRadius: token.input.radius,
      border: `${token.borderWidth.thin} solid ${borderColor}`,
      // Token-driven focus ring (avoids the default UA outline while staying on-token).
      boxShadow: focused
        ? `0 0 0 ${token.borderWidth.thick} ${token.color.border.focus}`
        : undefined,
      outline: 'none',
      background: isDisabled ? token.color.bg.muted : token.color.bg.surface,
      color: isDisabled ? token.color.text.muted : token.color.text.primary,
      cursor: isDisabled ? 'not-allowed' : 'text',
      transition: 'border-color 120ms ease, box-shadow 120ms ease',
      ...style,
    };

    return (
      <input
        ref={ref}
        disabled={isDisabled}
        aria-invalid={isError || undefined}
        className={['type-body', className].filter(Boolean).join(' ')}
        style={baseStyle}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    );
  },
);

TextField.displayName = 'TextField';
