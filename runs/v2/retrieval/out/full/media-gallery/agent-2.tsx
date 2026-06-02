import { useState, useCallback } from 'react';
import {
  Stack,
  Heading,
  Text,
  Gallery,
  Grid,
  AspectRatio,
  Image,
  Lightbox,
  Container,
  token,
} from '@/ds';

export type MediaItem = {
  id: string;
  src: string;
  thumbnailSrc?: string;
  alt: string;
  caption?: string;
};

export type MediaGalleryProps = {
  title?: string;
  description?: string;
  items: MediaItem[];
};

export function MediaGallery({
  title = 'Media Gallery',
  description,
  items,
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading variant="h2">{title}</Heading>
          {description ? (
            <Text variant="body" color={token.color.text.muted}>
              {description}
            </Text>
          ) : null}
        </Stack>

        <Gallery>
          <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="md">
            {items.map((item, index) => (
              <Gallery.Item
                key={item.id}
                onClick={() => open(index)}
                aria-label={`Open ${item.alt}`}
              >
                <Stack gap="xs">
                  <AspectRatio ratio={4 / 3} radius={token.radius.md}>
                    <Image
                      src={item.thumbnailSrc ?? item.src}
                      alt={item.alt}
                      fit="cover"
                    />
                  </AspectRatio>
                  {item.caption ? (
                    <Text variant="caption" color={token.color.text.muted}>
                      {item.caption}
                    </Text>
                  ) : null}
                </Stack>
              </Gallery.Item>
            ))}
          </Grid>
        </Gallery>

        <Lightbox
          open={isOpen}
          index={activeIndex ?? 0}
          onIndexChange={setActiveIndex}
          onClose={close}
        >
          {items.map((item) => (
            <Lightbox.Slide key={item.id}>
              <Image src={item.src} alt={item.alt} fit="contain" />
              {item.caption ? (
                <Lightbox.Caption>
                  <Text variant="body" color={token.color.text.onMedia}>
                    {item.caption}
                  </Text>
                </Lightbox.Caption>
              ) : null}
            </Lightbox.Slide>
          ))}
        </Lightbox>
      </Stack>
    </Container>
  );
}

export default MediaGallery;
