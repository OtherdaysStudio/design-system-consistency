import { forwardRef, useId } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { token, Stack, Text } from '@/ds';

/**
 * StatSparkline — a compact inline trend visualization for a single stat.
 *
 * Renders a small SVG sparkline (a continuous trend line or a row of mini bars)
 * whose stroke/fill is a token status color. There is NO axis, grid, legend, or
 * tooltip — it is decorative micro-context that sits beside a metric, not a
 * full chart. For anything that needs axes, ticks, or interaction, use a real
 * charting component instead.
 *
 * size:    sm | md | lg   — registered footprint (height from size.control.*).
 * tone:    neutral | success | danger — semantic direction of the trend; maps
 *          to color.status.* (success = up/good, danger = down/bad, neutral = flat).
 * variant: line | bar     — line trend (stroke) vs. mini bars (fill).
 *
 * Never hand-roll an inline <svg> with a raw hex stroke and pixel width to fake
 * a trend line — use <StatSparkline>.
 */

export type StatSparklineSize = 'sm' | 'md' | 'lg';
export type StatSparklineTone = 'neutral' | 'success' | 'danger';
export type StatSparklineVariant = 'line' | 'bar';

/** Footprint per size, derived from registered control sizes. */
const SIZE_DIM: Record<StatSparklineSize, { height: string; width: string; stroke: string; gap: StackGapToken }> = {
  sm: { height: token.size.control.sm, width: token.size.control.lg, stroke: token.borderWidth.thin, gap: 'xs' },
  md: { height: token.size.control.md, width: token.size.control.lg, stroke: token.borderWidth.thick, gap: 'sm' },
  lg: { height: token.size.control.lg, width: token.size.control.lg, stroke: token.borderWidth.thick, gap: 'sm' },
};

type StackGapToken = 'xs' | 'sm';

/** Semantic trend color per tone, from the status token family. */
const TONE_COLOR: Record<StatSparklineTone, { stroke: string; fill: string }> = {
  neutral: { stroke: token.color.text.muted, fill: token.color.bg.muted },
  success: { stroke: token.color.status.success, fill: token.color.status.successBg },
  danger: { stroke: token.color.status.danger, fill: token.color.status.dangerBg },
};

/** Text color per tone for the optional inline label. */
const TONE_TEXT: Record<StatSparklineTone, 'muted' | 'primary'> = {
  neutral: 'muted',
  success: 'primary',
  danger: 'primary',
};

/** Internal, unitless viewBox the points are normalized into (no axis is drawn). */
const VIEW_W = 100;
const VIEW_H = 32;
const PAD = 3;

function normalize(data: number[]): { x: number; y: number }[] {
  const n = data.length;
  if (n === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const innerW = VIEW_W - PAD * 2;
  const innerH = VIEW_H - PAD * 2;
  return data.map((v, i) => ({
    x: PAD + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: PAD + innerH - ((v - min) / span) * innerH,
  }));
}

export interface StatSparklineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The series to plot. Order is left-to-right; values are auto-normalized. */
  data: number[];
  size?: StatSparklineSize;
  tone?: StatSparklineTone;
  variant?: StatSparklineVariant;
  /** Optional trailing value/delta label rendered beside the graph. */
  label?: string;
  /** Accessible description of the trend. */
  'aria-label'?: string;
}

export const StatSparkline = forwardRef<HTMLDivElement, StatSparklineProps>(function StatSparkline(
  {
    data,
    size = 'md',
    tone = 'neutral',
    variant = 'line',
    label,
    style,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const dim = SIZE_DIM[size];
  const palette = TONE_COLOR[tone];
  const points = normalize(data);
  const gradientId = useId();

  const svgStyle: CSSProperties = {
    display: 'block',
    width: dim.width,
    height: dim.height,
    overflow: 'visible',
  };

  const linePath =
    points.length > 0 ? points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ') : '';
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1]!.x} ${VIEW_H - PAD} L${points[0]!.x} ${VIEW_H - PAD} Z`
      : '';

  const barWidth = points.length > 0 ? (VIEW_W - PAD * 2) / points.length - 1 : 0;

  const graph = (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel ?? `${tone} trend`}
      style={svgStyle}
    >
      {variant === 'line' ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.fill} stopOpacity={1} />
              <stop offset="100%" stopColor={palette.fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          {points.length > 1 && <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
          <path
            d={linePath}
            fill="none"
            stroke={palette.stroke}
            strokeWidth={dim.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        points.map((p, i) => (
          <rect
            key={i}
            x={p.x - barWidth / 2}
            y={p.y}
            width={Math.max(barWidth, 1)}
            height={VIEW_H - PAD - p.y}
            fill={palette.stroke}
            rx={1}
          />
        ))
      )}
    </svg>
  );

  if (!label) {
    return (
      <div ref={ref} style={{ display: 'inline-flex', ...style }} {...rest}>
        {graph}
      </div>
    );
  }

  return (
    <Stack
      ref={ref}
      direction="row"
      gap={dim.gap}
      align="center"
      style={{ display: 'inline-flex', width: 'auto', ...style }}
      {...rest}
    >
      {graph}
      <Text variant="caption" color={TONE_TEXT[tone]}>
        {label}
      </Text>
    </Stack>
  );
});

StatSparkline.displayName = 'StatSparkline';
