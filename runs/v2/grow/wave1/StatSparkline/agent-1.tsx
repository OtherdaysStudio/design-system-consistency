import { forwardRef, useId } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { Stack, token } from '@/ds';

/**
 * StatSparkline — a compact, axis-less inline trend chart for a single stat.
 *
 * Renders a tiny SVG line (or bars) summarising a series of numbers next to a
 * metric. It conveys DIRECTION at a glance, not precise values — there is no
 * axis, gridline, label, or tooltip. For a full, readable chart with axes use a
 * dedicated chart component; for a static status pill use <Badge>.
 *
 * size:    sm | md | lg   — registered footprint presets (token-driven box).
 * tone:    up | down      — trend direction; maps stroke to status.success /
 *                           status.danger so colour matches meaning.
 * variant: line | bar     — visual form of the series.
 *
 * Stroke/fill colours come ONLY from the token accessor; geometry is derived
 * from the data and the size preset. Never hand-roll an inline <svg> sparkline
 * with a raw hex stroke or px sizing.
 */

export type StatSparklineSize = 'sm' | 'md' | 'lg';
export type StatSparklineTone = 'up' | 'down';
export type StatSparklineVariant = 'line' | 'bar';

interface SizePreset {
  /** Box dimensions, expressed as size/space tokens. */
  width: string;
  height: string;
  /** Stroke width, expressed as a border-width token. */
  stroke: string;
}

const SIZE_PRESET: Record<StatSparklineSize, SizePreset> = {
  sm: { width: token.size.control.lg, height: token.size.icon.sm, stroke: token.borderWidth.thin },
  md: { width: token.size.control.lg, height: token.size.icon.lg, stroke: token.borderWidth.thin },
  lg: { width: token.size.control.lg, height: token.size.control.md, stroke: token.borderWidth.thick },
};

const TONE_COLOR: Record<StatSparklineTone, string> = {
  up: token.color.status.success,
  down: token.color.status.danger,
};

export interface StatSparklineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Series of numeric samples (>= 2). Only relative shape matters; no axis. */
  data: number[];
  size?: StatSparklineSize;
  tone?: StatSparklineTone;
  variant?: StatSparklineVariant;
  /** Accessible summary, e.g. "Revenue up 12% over 7 days". */
  label?: string;
}

/** Map samples into a 0..1 normalized space within a unit viewBox. */
function normalize(data: number[]): { x: number; y: number }[] {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data.map((v, i) => ({
    x: n === 1 ? 0 : i / (n - 1),
    y: 1 - (v - min) / span,
  }));
}

export const StatSparkline = forwardRef<HTMLDivElement, StatSparklineProps>(
  function StatSparkline(
    { data, size = 'md', tone = 'up', variant = 'line', label, style, ...rest },
    ref,
  ) {
    const titleId = useId();
    const preset = SIZE_PRESET[size];
    const color = TONE_COLOR[tone];

    // Unit viewBox keeps geometry token-agnostic; CSS box uses tokens for size.
    const VB = 100;
    const points = normalize(data.length >= 2 ? data : [0, 0]);

    const boxStyle: CSSProperties = {
      display: 'inline-flex',
      width: preset.width,
      height: preset.height,
      ...style,
    };

    return (
      <Stack
        ref={ref}
        direction="row"
        gap="none"
        align="center"
        style={boxStyle}
        role="img"
        aria-labelledby={label ? titleId : undefined}
        aria-hidden={label ? undefined : true}
        {...rest}
      >
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {label ? <title id={titleId}>{label}</title> : null}
          {variant === 'bar'
            ? points.map((p, i) => {
                const bw = VB / (points.length * 1.6);
                const x = p.x * VB - bw / 2;
                const y = p.y * VB;
                return (
                  <rect
                    key={i}
                    x={Math.max(0, x)}
                    y={y}
                    width={bw}
                    height={Math.max(0, VB - y)}
                    fill={color}
                    rx={1}
                  />
                );
              })
            : (
              <polyline
                points={points.map((p) => `${p.x * VB},${p.y * VB}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={preset.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
        </svg>
      </Stack>
    );
  },
);

StatSparkline.displayName = 'StatSparkline';
