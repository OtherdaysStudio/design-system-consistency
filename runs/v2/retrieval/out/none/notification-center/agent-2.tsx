import {
  Stack,
  Inline,
  Box,
  Text,
  Icon,
  Badge,
  Button,
  Avatar,
  Divider,
  Card,
  EmptyState,
  IconButton,
  token,
} from '@/ds';

export type NotificationKind = 'alert' | 'notice';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timestamp: string;
  read?: boolean;
  actorName?: string;
  actorAvatarUrl?: string;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const KIND_ICON: Record<NotificationKind, string> = {
  alert: 'alert-triangle',
  notice: 'info',
};

const KIND_TONE: Record<NotificationKind, 'danger' | 'info'> = {
  alert: 'danger',
  notice: 'info',
};

function NotificationRow({
  item,
  onDismiss,
  onSelect,
}: {
  item: NotificationItem;
  onDismiss?: (id: string) => void;
  onSelect?: (id: string) => void;
}) {
  return (
    <Box
      as="button"
      onClick={() => onSelect?.(item.id)}
      padding={token.space.md}
      borderRadius={token.radius.md}
      background={item.read ? token.color.surface.base : token.color.surface.raised}
    >
      <Inline gap={token.space.md} align="start">
        {item.actorAvatarUrl || item.actorName ? (
          <Avatar src={item.actorAvatarUrl} name={item.actorName} size="sm" />
        ) : (
          <Box
            padding={token.space.xs}
            borderRadius={token.radius.full}
            background={token.color.surface.sunken}
          >
            <Icon name={KIND_ICON[item.kind]} tone={KIND_TONE[item.kind]} size="sm" />
          </Box>
        )}

        <Stack gap={token.space.xs} grow>
          <Inline gap={token.space.sm} align="center" justify="between">
            <Inline gap={token.space.xs} align="center">
              {!item.read && <Badge tone={KIND_TONE[item.kind]} variant="dot" />}
              <Text variant="bodyStrong">{item.title}</Text>
            </Inline>
            <Text variant="caption" tone="muted">
              {item.timestamp}
            </Text>
          </Inline>

          <Text variant="body" tone="muted">
            {item.body}
          </Text>
        </Stack>

        {onDismiss && (
          <IconButton
            icon="x"
            label="Dismiss"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(item.id);
            }}
          />
        )}
      </Inline>
    </Box>
  );
}

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onDismiss,
  onSelect,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isEmpty = notifications.length === 0;

  return (
    <Card padding="none" width={token.size.panel.sm}>
      <Stack gap={token.space.none}>
        <Box padding={token.space.lg}>
          <Inline gap={token.space.sm} align="center" justify="between">
            <Inline gap={token.space.sm} align="center">
              <Text variant="headingSm">Notifications</Text>
              {unreadCount > 0 && (
                <Badge tone="danger" variant="solid">
                  {unreadCount}
                </Badge>
              )}
            </Inline>
            {unreadCount > 0 && (
              <Button variant="tertiary" size="sm" onClick={onMarkAllRead}>
                Mark all read
              </Button>
            )}
          </Inline>
        </Box>

        <Divider />

        {isEmpty ? (
          <Box padding={token.space.xl}>
            <EmptyState
              icon="bell"
              title="You're all caught up"
              description="New alerts and notices will show up here."
            />
          </Box>
        ) : (
          <Box padding={token.space.sm}>
            <Stack gap={token.space.xs} divider={<Divider />}>
              {notifications.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onDismiss={onDismiss}
                  onSelect={onSelect}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

export default NotificationCenter;
