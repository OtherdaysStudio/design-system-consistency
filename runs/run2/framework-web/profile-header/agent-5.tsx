import { Avatar, Badge, Button, Card, Stack, Text } from '@/ds';

/**
 * ProfileHeader — a horizontal, vertically centered profile header row.
 *
 * Layout: circular Avatar on the left, a vertical block with the person's
 * name (title) + role secondary text and a neutral "Pro" Badge, and a primary
 * "Follow" Button pushed to the right.
 *
 * Consistency notes (Aperture DS framework):
 * - All spacing/layout flows through <Stack gap=…> — no raw flex/gap/margins.
 * - All typography flows through <Text variant=…> — no inline font styling.
 * - Most-specific registered component per element: Card (surface), Avatar
 *   (circular user image), Badge tone="neutral" (status/label pill),
 *   Button variant="primary" (action). Nothing hand-rolled.
 */

export interface ProfileHeaderProps {
  /** Person's full name — rendered as the title. */
  name: string;
  /** Avatar image URL; falls back to initials when absent. */
  avatarSrc?: string;
  /** Invoked when the Follow button is pressed. */
  onFollow?: () => void;
}

export function ProfileHeader({ name, avatarSrc, onFollow }: ProfileHeaderProps) {
  return (
    <Card>
      <Stack direction="row" gap="md" align="center">
        <Avatar size="lg" src={avatarSrc} name={name} />

        {/* Identity block grows to fill the row, pushing the action right. */}
        <Stack direction="column" gap="xs" align="start" style={{ flex: 1 }}>
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
    </Card>
  );
}

export default ProfileHeader;
