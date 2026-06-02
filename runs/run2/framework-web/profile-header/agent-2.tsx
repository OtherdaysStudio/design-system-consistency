import { Avatar, Badge, Button, Stack, Text } from '@/ds';

/**
 * ProfileHeader — a horizontal, vertically-centered user identity row.
 *
 * Layout: [Avatar] · [ name (title) + role (secondary) + Pro badge ] ......... [Follow]
 *
 * Canonical-path notes:
 * - Every gap/alignment goes through <Stack> (no raw flex or margins).
 * - Type is set ONLY via <Text variant>; the role is secondary text.
 * - Avatar / Badge / Button are reused from '@/ds' — nothing is hand-rolled.
 * - No raw style literals: layout is structural, color/type/spacing are tokenised
 *   inside the reused components.
 */

export interface ProfileHeaderProps {
  /** Person's display name — rendered as the title. */
  name: string;
  /** Optional avatar image URL; falls back to initials from `name`. */
  avatarSrc?: string;
  /** Invoked when the Follow button is pressed. */
  onFollow?: () => void;
}

export function ProfileHeader({ name, avatarSrc, onFollow }: ProfileHeaderProps) {
  return (
    <Stack direction="row" align="center" gap="md">
      <Avatar size="lg" name={name} src={avatarSrc} />

      <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
        <Text variant="title" color="primary">
          {name}
        </Text>
        <Stack direction="row" align="center" gap="sm">
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
