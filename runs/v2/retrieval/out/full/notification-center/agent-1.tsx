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
  EmptyState,
  ScrollArea,
  StatusDot,
  token,
} from '@/ds';

type Notification = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  unread?: boolean;
  timestamp: string;
};

export type NotificationCenterProps = {
  notifications?: Notification[];
};

export function NotificationCenter({ notifications = [] }: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Box
      style={{
        backgroundColor: token.color.surface.raised,
        borderRadius: token.radius.lg,
        borderWidth: token.border.width.thin,
        borderColor: token.color.border.subtle,
        boxShadow: token.shadow.lg,
        width: token.size.panel.md,
        overflow: 'hidden',
      }}
    >
      <Stack gap="none">
        <Box style={{ padding: token.space.lg }}>
          <Stack direction="row" gap="sm" align="center" justify="between">
            <Stack direction="row" gap="sm" align="center">
              <Heading size="sm">Notifications</Heading>
              {unreadCount > 0 ? (
                <Badge variant="solid" tone="danger" size="sm">
                  {unreadCount}
                </Badge>
              ) : null}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box style={{ padding: token.space.xl }}>
            <EmptyState
              title="You're all caught up"
              description="New alerts and notices will appear here."
            />
          </Box>
        ) : (
          <ScrollArea style={{ maxHeight: token.size.scroll.lg }}>
            <List>
              {notifications.map((n) => (
                <ListItem key={n.id}>
                  <Box
                    style={{
                      padding: token.space.md,
                      backgroundColor: n.unread
                        ? token.color.surface.accentSubtle
                        : token.color.surface.raised,
                    }}
                  >
                    <Stack direction="row" gap="sm" align="start">
                      <Box style={{ paddingTop: token.space.xs }}>
                        <StatusDot
                          tone={
                            n.severity === 'error'
                              ? 'danger'
                              : n.severity === 'warning'
                                ? 'warning'
                                : n.severity === 'success'
                                  ? 'success'
                                  : 'info'
                          }
                        />
                      </Box>
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Alert variant="subtle" tone={n.severity} title={n.title}>
                          <Text variant="body" tone="muted">
                            {n.description}
                          </Text>
                        </Alert>
                        <Text variant="caption" tone="subtle">
                          {n.timestamp}
                        </Text>
                      </Stack>
                      {n.unread ? (
                        <Badge variant="dot" tone="danger" size="sm" />
                      ) : null}
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
