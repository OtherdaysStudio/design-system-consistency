import { useCallback, useState } from 'react';
import {
  Box,
  Stack,
  Grid,
  Text,
  Image,
  AspectRatio,
  Pressable,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  VisuallyHidden,
  token,
} from '@/ds';

export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type MediaGalleryProps = {
  heading?: string;
  description?: string;
  items: MediaItem[];
};

export function MediaGallery({
  heading = 'Media Gallery',
  description,
  items,
}: MediaGalleryProps) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  const handleOpen = useCallback((item: MediaItem) => {
    setActiveItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setActiveItem(null);
  }, []);

  return (
    <Box as="section" paddingY={token.space.xl} paddingX={token.space.lg}>
      <Stack gap={token.space.lg}>
        <Stack gap={token.space.xs}>
          <Text as="h2" variant="headingLg">
            {heading}
          </Text>
          {description ? (
            <Text variant="bodyMd" color={token.color.text.secondary}>
              {description}
            </Text>
          ) : null}
        </Stack>

        <Grid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          gap={token.space.md}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleOpen(item)}
              borderRadius={token.radius.md}
              focusRingColor={token.color.border.focus}
              aria-label={`Open ${item.alt}`}
            >
              <Stack gap={token.space.xs}>
                <AspectRatio ratio={1}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fit="cover"
                    borderRadius={token.radius.md}
                  />
                </AspectRatio>
                {item.caption ? (
                  <Text variant="bodySm" color={token.color.text.secondary}>
                    {item.caption}
                  </Text>
                ) : null}
              </Stack>
            </Pressable>
          ))}
        </Grid>
      </Stack>

      <Modal isOpen={activeItem !== null} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text variant="headingSm">{activeItem?.alt ?? ''}</Text>
            <ModalCloseButton aria-label="Close media viewer" />
          </ModalHeader>
          <ModalBody>
            {activeItem ? (
              <Stack gap={token.space.md}>
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={activeItem.src}
                    alt={activeItem.alt}
                    fit="contain"
                    borderRadius={token.radius.md}
                  />
                </AspectRatio>
                {activeItem.caption ? (
                  <Text variant="bodyMd" color={token.color.text.secondary}>
                    {activeItem.caption}
                  </Text>
                ) : (
                  <VisuallyHidden>{activeItem.alt}</VisuallyHidden>
                )}
              </Stack>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MediaGallery;
