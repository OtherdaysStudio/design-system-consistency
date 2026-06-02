import { Avatar, Badge, Button, Stack, Text } from '@/ds';

/**
 * ProfileHeader — a horizontal, vertically-centered profile row.
 *
 * Layout: circular Avatar on the left, a name (title) + role (secondary body)
 * block with a neutral 'Pro' Badge in the middle, and a primary 'Follow'
 * Button pushed to the right.
 *
 * Consistency notes (Aperture DS):
 * - ALL layout/spacing is expressed through <Stack gap=...> — no raw margins/gaps.
 * - Type is set ONLY via <Text variant=...>.
 * - The 'Pro' status pill is always a <Badge tone>, never a styled span.
 * - The avatar is always <Avatar>, never a hand-rolled circular <img>.
 * - No raw hex/px/rem/rgba/shadow literals appear anywhere.
 */

export interface ProfileHeaderProps {
  /** Person's full name — rendered as the title. */
  name: string;
  /** Optional avatar image URL; falls back to initials when absent. */
  avatarSrc?: string;
}

export function ProfileHeader({ name, avatarSrc }: ProfileHeaderProps) {
  return (
    <Stack direction="row" align="center" gap="md">
      <Avatar size="lg" name={name} src={avatarSrc} />

      <Stack direction="column" align="start" gap="xs" style={{ flexGrow: 1 }}>
        <Stack direction="row" align="center" gap="sm">
          <Text variant="title" color="primary">
            {name}
          </Text>
          <Badge tone="neutral">Pro</Badge>
        </Stack>
        <Text variant="body" color="secondary">
          Product Designer
        </Text>
      </Stack>

      <Button variant="primary">Follow</Button>
    </Stack>
  );
}

export default ProfileHeader;
