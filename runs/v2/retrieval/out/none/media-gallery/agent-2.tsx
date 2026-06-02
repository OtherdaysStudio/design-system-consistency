import { useState, useCallback } from 'react';
import {
  Stack,
  Box,
  Grid,
  Text,
  Image,
  AspectRatio,
  Pressable,
  Modal,
  IconButton,
  Icon,
  token,
} from '@/ds';

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface MediaGalleryProps {
  heading?: string;
  description?: string;
  items: MediaItem[];
}

export function MediaGallery({
  heading = 'Gallery',
  description,
  items,
}: MediaGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = items.find((item) => item.id === activeId) ?? null;

  const open = useCallback((id: string) => setActiveId(id), []);
  const close = useCallback(() => setActiveId(null), []);

  return (
    <Box as="section" padding={token.space.xl}>
      <Stack gap={token.space.lg}>
        <Stack gap={token.space.xs}>
          <Text as="h2" variant="headingLg">
            {heading}
          </Text>
          {description ? (
            <Text variant="bodyMd" color={token.color.text.subtle}>
              {description}
            </Text>
          ) : null}
        </Stack>

        <Grid
          columns={{ base: 1, sm: 2, lg: 3 }}
          gap={token.space.md}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => open(item.id)}
              aria-label={`View ${item.alt} larger`}
              borderRadius={token.radius.md}
            >
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fit="cover"
                  borderRadius={token.radius.md}
                />
              </AspectRatio>
              {item.caption ? (
                <Box paddingTop={token.space.xs}>
                  <Text variant="bodySm" color={token.color.text.subtle}>
                    {item.caption}
                  </Text>
                </Box>
              ) : null}
            </Pressable>
          ))}
        </Grid>
      </Stack>

      <Modal
        isOpen={activeItem !== null}
        onClose={close}
        size="lg"
        aria-label={activeItem?.alt ?? 'Media preview'}
      >
        <Box position="relative" padding={token.space.md}>
          <Box
            position="absolute"
            top={token.space.sm}
            right={token.space.sm}
            zIndex={token.zIndex.overlay}
          >
            <IconButton
              variant="ghost"
              onPress={close}
              aria-label="Close preview"
            >
              <Icon name="close" />
            </IconButton>
          </Box>

          {activeItem ? (
            <Stack gap={token.space.sm}>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fit="contain"
                  borderRadius={token.radius.md}
                />
              </AspectRatio>
              {activeItem.caption ? (
                <Text variant="bodyMd" color={token.color.text.subtle}>
                  {activeItem.caption}
                </Text>
              ) : null}
            </Stack>
          ) : null}
        </Box>
      </Modal>
    </Box>
  );
}

export default MediaGallery;
