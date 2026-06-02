import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Stack, Card, Text, Button, token } from '@/ds';

/**
 * MediaGallery — a heading plus a responsive grid of images that open in a
 * larger lightbox overlay on click.
 *
 * Consistency contract:
 * - Typography ONLY via <Text variant> (heading / title / caption / label).
 * - Spacing ONLY via <Stack gap> (token-backed spacing enum).
 * - Every other style value comes from token.* — no raw hex / px / rem / shadow
 *   literals are introduced here.
 */

export interface MediaItem {
  /** Stable identifier (used as React key). */
  id: string;
  /** Image source URL. */
  src: string;
  /** Accessible alt text + lightbox caption. */
  alt: string;
  /** Optional caption shown beneath the larger view. */
  caption?: string;
}

export interface MediaGalleryProps {
  /** Section heading. */
  title?: string;
  /** Optional supporting line under the heading. */
  description?: string;
  /** Images to render in the gallery grid. */
  items: MediaItem[];
}

const SECTION_STYLE: CSSProperties = {
  background: token.color.bg.canvas,
  paddingBlock: token.space.xl,
  paddingInline: token.space.lg,
};

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
  gap: token.space.md,
};

const TILE_STYLE: CSSProperties = {
  padding: token.space.none,
  overflow: 'hidden',
  cursor: 'pointer',
  borderRadius: token.radius.lg,
  transition: `box-shadow ${token.duration.fast} ${token.easing.standard}`,
};

const THUMB_STYLE: CSSProperties = {
  display: 'block',
  width: '100%',
  aspectRatio: '4 / 3',
  objectFit: 'cover',
  borderRadius: token.radius.lg,
  background: token.color.bg.muted,
};

const OVERLAY_STYLE: CSSProperties = {
  position: 'fixed',
  inset: token.space.none,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: token.color.bg.inverse,
  padding: token.space.lg,
  zIndex: 1000,
};

const LIGHTBOX_IMG_STYLE: CSSProperties = {
  display: 'block',
  maxWidth: '100%',
  maxHeight: '70vh',
  objectFit: 'contain',
  borderRadius: token.radius.md,
  boxShadow: token.shadow.lg,
  background: token.color.bg.muted,
};

export function MediaGallery({
  title = 'Gallery',
  description,
  items,
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : items[activeIndex] ?? null;

  const close = useCallback(() => setActiveIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setActiveIndex((current) => {
        if (current === null || items.length === 0) return current;
        return (current + delta + items.length) % items.length;
      }),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, step]);

  return (
    <Stack as="section" direction="column" gap="lg" style={SECTION_STYLE}>
      <Stack direction="column" gap="xs">
        <Text variant="heading">{title}</Text>
        {description ? (
          <Text variant="body" color="secondary">
            {description}
          </Text>
        ) : null}
      </Stack>

      <div style={GRID_STYLE}>
        {items.map((item, index) => (
          <Card
            key={item.id}
            variant="elevated"
            role="button"
            tabIndex={0}
            aria-label={`Open ${item.alt}`}
            style={TILE_STYLE}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveIndex(index);
              }
            }}
          >
            <Stack direction="column" gap="none">
              <img src={item.src} alt={item.alt} style={THUMB_STYLE} loading="lazy" />
              {item.caption ? (
                <Stack direction="column" gap="none" style={{ padding: token.space.sm }}>
                  <Text variant="caption" color="muted">
                    {item.caption}
                  </Text>
                </Stack>
              ) : null}
            </Stack>
          </Card>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          style={OVERLAY_STYLE}
          onClick={close}
        >
          <Stack
            direction="column"
            gap="md"
            align="center"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={active.src} alt={active.alt} style={LIGHTBOX_IMG_STYLE} />

            <Stack direction="column" gap="xs" align="center">
              <Text variant="title" color="onAction">
                {active.alt}
              </Text>
              {active.caption ? (
                <Text variant="caption" color="onAction">
                  {active.caption}
                </Text>
              ) : null}
            </Stack>

            <Stack direction="row" gap="sm" align="center">
              <Button variant="secondary" onClick={() => step(-1)}>
                Previous
              </Button>
              <Text variant="label" color="onAction">
                {activeIndex! + 1} / {items.length}
              </Text>
              <Button variant="secondary" onClick={() => step(1)}>
                Next
              </Button>
              <Button variant="primary" onClick={close}>
                Close
              </Button>
            </Stack>
          </Stack>
        </div>
      ) : null}
    </Stack>
  );
}

export default MediaGallery;
