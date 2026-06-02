import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { token } from './tokens';

/**
 * Avatar — circular user image or initials fallback at registered sizes.
 *
 * size: sm | md | lg  (mapped to size.control.*)
 *
 * Pill radius keeps it circular. When `src` is absent (or fails to load) the
 * `name` initials render on a muted surface. Never hand-roll an <img> with
 * inline border-radius:50% and ad-hoc width.
 */

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_TOKEN: Record<AvatarSize, string> = {
  sm: token.size.control.sm,
  md: token.size.control.md,
  lg: token.size.control.lg,
};

/** Typography preset per avatar size for the initials fallback. */
const INITIALS_TYPE: Record<AvatarSize, string> = {
  sm: 'type-caption',
  md: 'type-label',
  lg: 'type-title',
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: AvatarSize;
  /** Image URL. Falls back to initials when absent. */
  src?: string;
  /** Full name — used for the alt text and the initials fallback. */
  name: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'md', src, name, className, style, ...rest },
  ref,
) {
  const dimension = SIZE_TOKEN[size];

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension,
    height: dimension,
    borderRadius: token.radius.pill,
    overflow: 'hidden',
    background: token.color.bg.muted,
    color: token.color.text.secondary,
    flexShrink: 0,
    userSelect: 'none',
    ...style,
  };

  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={[!src && INITIALS_TYPE[size], className].filter(Boolean).join(' ')}
      style={baseStyle}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          width="100%"
          height="100%"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        initialsFromName(name)
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';
