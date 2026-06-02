import {
  Stack,
  Box,
  Heading,
  Text,
  Badge,
  Divider,
  List,
  ListItem,
  Alert,
  Avatar,
  StatusDot,
  IconButton,
  EmptyState,
  Button,
  ScrollArea,
  Icon,
  token,
} from '@/ds';

type Severity = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: Severity;
  unread: boolean;
  actor?: string;
}

export interface NotificationCenterProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationCenter({
  notifications = [],
  onDismiss,
  onMarkAllRead,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;
  const isEmpty = notifications.length === 0;

  return (
    <Box
      style={{
        width: token.size.panel,
        maxWidth: token.size.full,
        background: token.color.surface,
        borderRadius: token.radius.lg,
        borderWidth: token.border.thin,
        borderColor: token.color.border,
        boxShadow: token.shadow.lg,
        overflow: 'hidden',
      }}
    >
      <Stack gap="none">
        <Box style={{ padding: token.space.lg }}>
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Stack direction="row" align="center" gap="sm">
              <Heading size="sm">Notifications</Heading>
              {unreadCount > 0 && (
                <Badge variant="solid" tone="danger" size="sm">
                  {unreadCount}
                </Badge>
              )}
            </Stack>
            {!isEmpty && unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                Mark all read
              </Button>
            )}
          </Stack>
        </Box>

        <Divider />

        {isEmpty ? (
          <Box style={{ padding: token.space.xl }}>
            <EmptyState
              size="md"
              icon={<Icon name="bell" />}
              title="You're all caught up"
              description="New alerts and notices will appear here when there's something to see."
            />
          </Box>
        ) : (
          <ScrollArea style={{ maxHeight: token.size.scrollPanel }}>
            <List>
              {notifications.map((n) => (
                <ListItem key={n.id}>
                  <Box
                    style={{
                      padding: token.space.md,
                      background: n.unread
                        ? token.color.surfaceRaised
                        : token.color.surface,
                    }}
                  >
                    <Stack direction="row" align="start" gap="sm">
                      {n.unread && <StatusDot tone="info" size="sm" />}
                      <Avatar size="sm" name={n.actor} />
                      <Stack gap="xs" style={{ flex: token.flex.grow }}>
                        <Stack
                          direction="row"
                          align="center"
                          justify="between"
                          gap="sm"
                        >
                          <Text variant="bodyStrong">{n.title}</Text>
                          <Text variant="caption" tone="muted">
                            {n.timestamp}
                          </Text>
                        </Stack>
                        <Alert variant="subtle" tone={n.severity} size="sm">
                          <Text variant="body">{n.description}</Text>
                        </Alert>
                      </Stack>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Dismiss notification"
                        icon={<Icon name="x" />}
                        onClick={() => onDismiss?.(n.id)}
                      />
                    </Stack>
                  </Box>
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        )}
      </Stack>
    </Box>
  );
}

export default NotificationCenter;
