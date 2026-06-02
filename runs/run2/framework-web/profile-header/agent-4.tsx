import { Avatar, Badge, Button, Stack, Text } from '@/ds';

/**
 * ProfileHeader — a horizontal, vertically-centered user profile row.
 *
 * Layout left→right: circular Avatar, a vertical block (name title + role
 * secondary text with a neutral "Pro" Badge), then a primary "Follow" Button
 * pushed to the right edge.
 *
 * Consistency notes (Aperture DS protocol):
 * - REUSED registered components only: Avatar, Text, Badge, Button, Stack.
 *   Nothing is hand-rolled.
 * - Typography exclusively via <Text variant>. No inline font values.
 * - ALL spacing/layout via <Stack gap> — never a raw spacing literal.
 * - The "Pro" status pill is the most-specific component (<Badge tone>).
 * - The right-edge placement is pure flex layout (flexGrow on the middle
 *   block); it carries no color/spacing/radius/font/shadow literal.
 */

export interface ProfileHeaderProps {
  /** Full name, rendered as the title. */
  name: string;
  /** Optional avatar image URL; falls back to initials from `name`. */
  avatarSrc?: string;
  /** Invoked when the Follow button is pressed. */
  onFollow?: () => void;
}

export function ProfileHeader({ name, avatarSrc, onFollow }: ProfileHeaderProps) {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar size="lg" name={name} src={avatarSrc} />

      <Stack direction="column" gap="xs" align="start" style={{ flexGrow: 1 }}>
        <Text variant="title" color="primary">
          {name}
        </Text>
        <Stack direction="row" gap="sm" align="center">
          <Text variant="body" color="secondary">
            Product Designer
          </Text>
          <Badge tone="neutral">Pro</Badge>
        </Stack>
      </Stack>

      <Button variant="primary" size="md" onClick={onFollow}>
        Follow
      </Button>
    </Stack>
  );
}

export default ProfileHeader;
