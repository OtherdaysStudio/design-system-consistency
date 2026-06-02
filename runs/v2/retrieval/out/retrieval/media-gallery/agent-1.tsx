import { useCallback, useState } from 'react';
import {
  Stack,
  Text,
  Grid,
  Image,
  Gallery,
  Lightbox,
  token,
} from '@/ds';

/**
 * MediaGallery — a heading plus a responsive grid of images that open larger
 * in a lightbox on click.
 *
 * Composition rules (Aperture DS):
 * - Typography ONLY via <Text variant>. No raw font-size/weight.
 * - Spacing ONLY via <Stack gap>. No ad-hoc margins/gaps.
 * - Layout via the registered <Grid>; image tiles via registered <Image>.
 * - The enlarged view reuses the registered <Lightbox> media overlay.
 * - Any remaining style value is a token.* (radius, focus ring, transitions),
 *   never a raw hex/px/rem/shadow literal.
 */

export interface MediaItem {
  id: string;
  src: string;
  /** Optional larger source for the lightbox; falls back to `src`. */
  fullSrc?: string;
  alt: string;
  caption?: string;
}

export interface MediaGalleryProps {
  /** Section heading. */
  title?: string;
  /** Optional supporting line under the heading. */
  description?: string;
  items: MediaItem[];
}

const SAMPLE_ITEMS: MediaItem[] = [
  { id: 'm1', src: '/media/aperture-01.jpg', alt: 'Long-exposure city skyline at dusk', caption: 'City skyline, dusk' },
  { id: 'm2', src: '/media/aperture-02.jpg', alt: 'Macro detail of a camera lens aperture blades', caption: 'Aperture blades' },
  { id: 'm3', src: '/media/aperture-03.jpg', alt: 'Snow-covered mountain ridge under clear sky', caption: 'Mountain ridge' },
  { id: 'm4', src: '/media/aperture-04.jpg', alt: 'Neon-lit street reflected on wet pavement', caption: 'Neon street' },
  { id: 'm5', src: '/media/aperture-05.jpg', alt: 'Studio portrait with soft rim lighting', caption: 'Studio portrait' },
  { id: 'm6', src: '/media/aperture-06.jpg', alt: 'Desert dunes at golden hour', caption: 'Desert dunes' },
];

export function MediaGallery({
  title = 'Media gallery',
  description = 'A selection of shots from the Aperture community. Tap any image to view it larger.',
  items = SAMPLE_ITEMS,
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  return (
    <Stack as="section" gap="lg" aria-label={title}>
      <Stack gap="xs">
        <Text variant="heading" as="h2">
          {title}
        </Text>
        {description ? (
          <Text variant="body" color="secondary">
            {description}
          </Text>
        ) : null}
      </Stack>

      {/* Registered Gallery wraps the responsive grid of media tiles. */}
      <Gallery>
        <Grid
          // Responsive auto-fit grid; column min-size and gutters come from tokens.
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
            gap: token.space.md,
          }}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => open(index)}
              aria-label={`Open ${item.alt} larger`}
              style={{
                appearance: 'none',
                padding: token.space.none,
                border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
                borderRadius: token.radius.md,
                background: token.color.bg.surface,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: token.shadow.sm,
                transition: `box-shadow ${token.duration.fast} ${token.easing.standard}`,
              }}
            >
              <Stack gap="xs">
                <Image
                  src={item.src}
                  alt={item.alt}
                  size="md"
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: token.radius.md,
                  }}
                />
                {item.caption ? (
                  <Text
                    variant="caption"
                    color="muted"
                    style={{ paddingInline: token.space.sm, paddingBottom: token.space.sm }}
                  >
                    {item.caption}
                  </Text>
                ) : null}
              </Stack>
            </button>
          ))}
        </Grid>
      </Gallery>

      {/* Registered Lightbox renders the enlarged image on click. */}
      {activeIndex !== null ? (
        <Lightbox
          open
          index={activeIndex}
          onClose={close}
          onIndexChange={setActiveIndex}
          items={items.map((item) => ({
            src: item.fullSrc ?? item.src,
            alt: item.alt,
            caption: item.caption,
          }))}
        />
      ) : null}
    </Stack>
  );
}

export default MediaGallery;
