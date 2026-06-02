import { useState } from 'react';
import {
  Stack,
  Heading,
  Text,
  Grid,
  AspectRatio,
  Image,
  Box,
  Modal,
  token,
} from '@/ds';

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface MediaGalleryProps {
  title?: string;
  description?: string;
  items: MediaItem[];
}

export function MediaGallery({
  title = 'Gallery',
  description,
  items,
}: MediaGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((item) => item.id === activeId) ?? null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Heading size="lg">{title}</Heading>
        {description ? (
          <Text variant="body" color={token.color.text.muted}>
            {description}
          </Text>
        ) : null}
      </Stack>

      <Grid columns={{ base: 1, sm: 2, md: 3 }} gap="md">
        {items.map((item) => (
          <Box
            key={item.id}
            as="button"
            onClick={() => setActiveId(item.id)}
            aria-label={`Open ${item.alt}`}
            padding="none"
            radius={token.radius.lg}
            overflow="hidden"
            background={token.color.surface.subtle}
            borderColor={token.color.border.subtle}
            cursor="pointer"
          >
            <AspectRatio ratio={4 / 3}>
              <Image src={item.src} alt={item.alt} fit="cover" />
            </AspectRatio>
          </Box>
        ))}
      </Grid>

      <Modal
        size="lg"
        open={active !== null}
        onClose={() => setActiveId(null)}
        aria-label={active?.alt}
      >
        {active ? (
          <Stack gap="sm">
            <AspectRatio ratio={16 / 9}>
              <Image src={active.src} alt={active.alt} fit="contain" />
            </AspectRatio>
            {active.caption ? (
              <Text variant="caption" color={token.color.text.muted}>
                {active.caption}
              </Text>
            ) : null}
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  );
}

export default MediaGallery;
