import { Card, Stack, Text, Badge, Button, token } from '@/ds';
import type { BadgeTone } from '@/ds';

/**
 * NotificationCenter — a panel listing alert/notice rows with an unread badge
 * in the header and a graceful empty state.
 *
 * Composed entirely from registered Aperture DS components (Card, Stack, Text,
 * Badge, Button). All non-enumerated style values come from token.* — no raw
 * hex/px/rem/shadow literals.
 */

export type NotificationKind = 'success' | 'warning' | 'danger' | 'info';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timestamp: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
}

/** Map a notification kind to a Badge tone + accent/background status token. */
const KIND_TONE: Record<NotificationKind, BadgeTone> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

const KIND_ACCENT: Record<NotificationKind, string> = {
  success: token.color.status.success,
  warning: token.color.status.warning,
  danger: token.color.status.danger,
  info: token.color.status.info,
};

const KIND_SURFACE: Record<NotificationKind, string> = {
  success: token.color.status.successBg,
  warning: token.color.status.warningBg,
  danger: token.color.status.dangerBg,
  info: token.color.status.infoBg,
};

const KIND_LABEL: Record<NotificationKind, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Alert',
  info: 'Notice',
};

function NotificationRow({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss?: (id: string) => void;
}) {
  return (
    <Card
      variant="default"
      style={{
        background: item.read ? token.color.bg.surface : KIND_SURFACE[item.kind],
        borderColor: token.color.border.default,
        borderLeft: `${token.borderWidth.thick} solid ${KIND_ACCENT[item.kind]}`,
        padding: token.space.md,
      }}
    >
      <Stack direction="row" gap="md" align="start">
        <Stack gap="xs" align="start" style={{ flex: 1, minWidth: token.space.none }}>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Badge tone={KIND_TONE[item.kind]}>{KIND_LABEL[item.kind]}</Badge>
            {!item.read && <Badge tone="info">New</Badge>}
            <Text variant="caption" color="muted">
              {item.timestamp}
            </Text>
          </Stack>
          <Text variant="label" color="primary">
            {item.title}
          </Text>
          <Text variant="body" color="secondary">
            {item.body}
          </Text>
        </Stack>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={() => onDismiss(item.id)}>
            Dismiss
          </Button>
        )}
      </Stack>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card
      variant="default"
      style={{
        background: token.color.bg.muted,
        borderColor: token.color.border.default,
        borderStyle: 'dashed',
        padding: token.space.xl,
      }}
    >
      <Stack gap="xs" align="center">
        <Text variant="title" color="secondary">
          You're all caught up
        </Text>
        <Text variant="body" color="muted">
          No notifications right now. New alerts and notices will appear here.
        </Text>
      </Stack>
    </Card>
  );
}

export function NotificationCenter({
  notifications = [],
  onMarkAllRead,
  onDismiss,
}: NotificationCenterProps) {
  const unreadCount = notifications.reduce((n, item) => (item.read ? n : n + 1), 0);
  const hasNotifications = notifications.length > 0;

  return (
    <Card
      variant="elevated"
      style={{
        width: '100%',
        maxWidth: token.size.control.lg,
        background: token.color.bg.surface,
      }}
    >
      <Stack gap="lg">
        <Stack
          direction="row"
          gap="md"
          align="center"
          style={{
            justifyContent: 'space-between',
            paddingBottom: token.space.md,
            borderBottom: `${token.borderWidth.thin} solid ${token.color.border.default}`,
          }}
        >
          <Stack direction="row" gap="sm" align="center">
            <Text variant="title" color="primary">
              Notifications
            </Text>
            {unreadCount > 0 && <Badge tone="danger">{unreadCount} unread</Badge>}
          </Stack>
          {hasNotifications && unreadCount > 0 && onMarkAllRead && (
            <Button variant="secondary" size="sm" onClick={onMarkAllRead}>
              Mark all read
            </Button>
          )}
        </Stack>

        {hasNotifications ? (
          <Stack gap="sm">
            {notifications.map((item) => (
              <NotificationRow key={item.id} item={item} onDismiss={onDismiss} />
            ))}
          </Stack>
        ) : (
          <EmptyState />
        )}
      </Stack>
    </Card>
  );
}

export default NotificationCenter;
