import {
  Panel,
  Stack,
  Inline,
  Text,
  Badge,
  Icon,
  IconButton,
  Avatar,
  Divider,
  Button,
  EmptyState,
  ScrollArea,
  Pressable,
  token,
} from '@/ds';

type NotificationKind = 'alert' | 'notice' | 'info' | 'success';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  description?: string;
  timestamp: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const kindToIcon: Record<NotificationKind, string> = {
  alert: 'alert-triangle',
  notice: 'bell',
  info: 'info-circle',
  success: 'check-circle',
};

const kindToBadgeTone: Record<NotificationKind, string> = {
  alert: 'danger',
  notice: 'warning',
  info: 'info',
  success: 'success',
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
    <Pressable
      onPress={() => onSelect?.(item.id)}
      padding={token.space.md}
      background={item.read ? token.color.surface.base : token.color.surface.raised}
      radius={token.radius.md}
    >
      <Inline gap="md" align="start">
        <Avatar
          icon={kindToIcon[item.kind]}
          tone={kindToBadgeTone[item.kind]}
          size="sm"
        />
        <Stack gap="2xs" grow>
          <Inline gap="xs" align="center" justify="between">
            <Inline gap="xs" align="center">
              <Text variant="bodyStrong">{item.title}</Text>
              {!item.read ? (
                <Badge tone={kindToBadgeTone[item.kind]} variant="dot" />
              ) : null}
            </Inline>
            <Text variant="caption" tone="muted">
              {item.timestamp}
            </Text>
          </Inline>
          {item.description ? (
            <Text variant="bodySmall" tone="muted">
              {item.description}
            </Text>
          ) : null}
        </Stack>
        <IconButton
          icon="x"
          size="sm"
          variant="ghost"
          aria-label="Dismiss notification"
          onPress={() => onDismiss?.(item.id)}
        />
      </Inline>
    </Pressable>
  );
}

export function NotificationCenter({
  notifications = [],
  onMarkAllRead,
  onDismiss,
  onSelect,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNotifications = notifications.length > 0;

  return (
    <Panel padding={token.space.none} width={token.size.panel.sm}>
      <Stack gap="none">
        <Inline
          gap="sm"
          align="center"
          justify="between"
          padding={token.space.lg}
        >
          <Inline gap="sm" align="center">
            <Icon name="bell" size="md" />
            <Text variant="headingSmall">Notifications</Text>
            {unreadCount > 0 ? (
              <Badge tone="danger" variant="count">
                {unreadCount}
              </Badge>
            ) : null}
          </Inline>
          {hasNotifications && unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onPress={onMarkAllRead}>
              Mark all read
            </Button>
          ) : null}
        </Inline>

        <Divider />

        {hasNotifications ? (
          <ScrollArea maxHeight={token.size.scroll.lg}>
            <Stack gap="2xs" padding={token.space.sm}>
              {notifications.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onDismiss={onDismiss}
                  onSelect={onSelect}
                />
              ))}
            </Stack>
          </ScrollArea>
        ) : (
          <Stack padding={token.space.xl} align="center">
            <EmptyState
              icon="bell-off"
              title="You're all caught up"
              description="New alerts and notices will show up here."
            />
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}

export default NotificationCenter;
