import React from 'react';
import { Stack, Text, token } from '@/ds';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'neutral' | 'success' | 'danger';
type Variant = 'primary' | 'secondary';

export interface StatSparklineProps {
  /** Series of numeric data points to plot. */
  data: number[];
  /** Maps the stroke/fill color to a status tone. up -> success, down -> danger. */
  tone?: Tone;
  /** Controls the rendered footprint (width/height/stroke). */
  size?: Size;
  /** primary = trend line, secondary = mini bars. */
  variant?: Variant;
  /** Optional short label rendered alongside the spark (e.g. the stat name). */
  label?: string;
  /** Accessible description of the trend. */
  ariaLabel?: string;
}

const DIMENSIONS: Record<Size, { width: number; height: number; stroke: number }> = {
  sm: { width: 48, height: 16, stroke: 1.5 },
  md: { width: 72, height: 24, stroke: 2 },
  lg: { width: 112, height: 36, stroke: 2.5 },
};

function toneColor(tone: Tone): string {
  switch (tone) {
    case 'success':
      return token.color.status.success;
    case 'danger':
      return token.color.status.danger;
    case 'neutral':
    default:
      return token.color.text.muted;
  }
}

/**
 * A compact, inline trend visualization for a single stat — a small SVG line
 * (primary) or mini bars (secondary), colored by status tone, with no axis.
 * NOT for full charts, legends, tooltips, or axis-bearing analytics graphs.
 */
export function StatSparkline({
  data,
  tone = 'neutral',
  size = 'md',
  variant = 'primary',
  label,
  ariaLabel,
}: StatSparklineProps) {
  const { width, height, stroke } = DIMENSIONS[size];
  const color = toneColor(tone);

  const pad = stroke;
  const innerW = Math.max(width - pad * 2, 1);
  const innerH = Math.max(height - pad * 2, 1);

  const points = data.length > 0 ? data : [0, 0];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;

  const x = (i: number) => pad + i * stepX;
  const y = (v: number) => pad + innerH - ((v - min) / range) * innerH;

  const linePath = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`)
    .join(' ');

  const barGap = points.length > 1 ? stepX * 0.35 : 0;
  const barWidth = Math.max((stepX || innerW) - barGap, 1);

  const svg = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? label ?? `${tone} trend`}
      style={{ display: 'block', borderRadius: token.radius.sm }}
      preserveAspectRatio="none"
    >
      {variant === 'secondary' ? (
        points.map((v, i) => {
          const top = y(v);
          const barX = points.length > 1 ? x(i) - barWidth / 2 : pad;
          return (
            <rect
              key={i}
              x={Math.max(barX, pad).toFixed(2)}
              y={top.toFixed(2)}
              width={barWidth.toFixed(2)}
              height={Math.max(pad + innerH - top, stroke).toFixed(2)}
              rx={token.radius.sm}
              fill={color}
            />
          );
        })
      ) : (
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  if (!label) {
    return svg;
  }

  return (
    <Stack direction="row" gap="xs" align="center">
      <Text variant="caption" color="muted">
        {label}
      </Text>
      {svg}
    </Stack>
  );
}

export default StatSparkline;
