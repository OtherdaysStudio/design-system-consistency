import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Card, Stack, Text, Badge, Button, token } from '@/ds';
import type { BadgeTone } from '@/ds';

/**
 * NotificationCenter — a panel for the Aperture web app.
 *
 * Composition only: every surface, type ramp, spacing step, and color comes
 * from registered '@/ds' primitives (Card / Stack / Text / Badge / Button) and
 * token.* values. No raw hex / px / rem / shadow literals are introduced.
 */

export type NotificationKind = 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  timestamp: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
}

/** Each notice kind maps 1:1 onto a registered Badge tone. */
const KIND_TONE: Record<NotificationKind, BadgeTone> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

const KIND_LABEL: Record<NotificationKind, string> = {
  info: 'Notice',
  success: 'Resolved',
  warning: 'Warning',
  danger: 'Alert',
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'danger',
    title: 'Aperture sync failed',
    body: 'The latest export could not reach the storage bucket. Retry to resume.',
    timestamp: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    kind: 'warning',
    title: 'Plan usage at 80%',
    body: 'You have used most of this cycle’s render minutes.',
    timestamp: '1h ago',
    read: false,
  },
  {
    id: 'n3',
    kind: 'info',
    title: 'New collaborator invited',
    body: 'Priya was added to the Northwind workspace.',
    timestamp: 'Yesterday',
    read: true,
  },
];

function NotificationRow({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss?: (id: string) => void;
}): ReactNode {
  const { id, kind, title, body, timestamp, read } = notification;

  return (
    <Stack
      direction="row"
      gap="md"
      align="start"
      style={{
        paddingBlock: token.space.md,
        borderBottom: `${token.borderWidth.thin} solid ${token.color.border.default}`,
        background: read ? 'transparent' : token.color.bg.muted,
        paddingInline: token.space.md,
        borderRadius: token.radius.sm,
      }}
    >
      {/* Unread marker — drawn from status + radius tokens, not a raw dot. */}
      <span
        aria-hidden
        style={{
          width: token.size.icon.sm,
          height: token.size.icon.sm,
          marginBlockStart: token.space.xs,
          borderRadius: token.radius.pill,
          flexShrink: 0,
          background: read ? token.color.border.default : token.color.status.info,
        }}
      />

      <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Badge tone={KIND_TONE[kind]}>{KIND_LABEL[kind]}</Badge>
          <Text variant="caption" color="muted">
            {timestamp}
          </Text>
        </Stack>

        <Text variant="label" color="primary">
          {title}
        </Text>

        <Text variant="body" color="secondary">
          {body}
        </Text>
      </Stack>

      {onDismiss ? (
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Dismiss ${title}`}
          onClick={() => onDismiss(id)}
        >
          Dismiss
        </Button>
      ) : null}
    </Stack>
  );
}

function EmptyNotifications(): ReactNode {
  return (
    <Stack
      gap="sm"
      align="center"
      style={{
        paddingBlock: token.space.xxl,
        paddingInline: token.space.lg,
        textAlign: 'center',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: token.size.control.lg,
          height: token.size.control.lg,
          borderRadius: token.radius.pill,
          background: token.color.bg.muted,
          color: token.color.text.muted,
        }}
      >
        <Text variant="title" color="muted">
          ✓
        </Text>
      </span>

      <Text variant="title" color="primary">
        You’re all caught up
      </Text>
      <Text variant="body" color="muted">
        New alerts and notices will appear here as they arrive.
      </Text>
    </Stack>
  );
}

export function NotificationCenter({
  notifications = DEFAULT_NOTIFICATIONS,
  onDismiss,
  onMarkAllRead,
}: NotificationCenterProps): ReactNode {
  const [items, setItems] = useState<Notification[]>(notifications);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    onDismiss?.(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const isEmpty = items.length === 0;

  return (
    <Card
      variant="elevated"
      role="region"
      aria-label="Notification center"
      style={{ width: token.size.control.lg, maxWidth: '100%' }}
    >
      <Stack gap="md">
        {/* Header — title, unread badge, and a bulk action. */}
        <Stack direction="row" gap="sm" align="center">
          <Stack direction="row" gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
            <Text variant="title" color="primary">
              Notifications
            </Text>
            {unreadCount > 0 ? (
              <Badge tone="danger" aria-label={`${unreadCount} unread`}>
                {unreadCount}
              </Badge>
            ) : null}
          </Stack>

          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          ) : null}
        </Stack>

        {/* List or empty state. */}
        {isEmpty ? (
          <EmptyNotifications />
        ) : (
          <Stack gap="none" role="list">
            {items.map((n) => (
              <div role="listitem" key={n.id}>
                <NotificationRow notification={n} onDismiss={handleDismiss} />
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export default NotificationCenter;
