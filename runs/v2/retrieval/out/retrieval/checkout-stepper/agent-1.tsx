import type { CSSProperties } from 'react';
import { Card, Stack, Text, Badge, token } from '@/ds';

/**
 * CheckoutStepper — a multi-step progress header for the Aperture checkout flow.
 *
 * Composed entirely from registered '@/ds' primitives: typography flows through
 * <Text variant>, all spacing through <Stack gap>, and every remaining style value
 * resolves to a token.* — no raw hex / px / rem / shadow literals.
 */

export type CheckoutStepStatus = 'complete' | 'current' | 'upcoming';

export interface CheckoutStep {
  id: string;
  label: string;
}

export interface CheckoutStepperProps {
  /** Ordered steps shown in the header. Defaults to the standard Aperture flow. */
  steps?: CheckoutStep[];
  /** Zero-based index of the step the shopper is currently on. */
  currentStep?: number;
}

const DEFAULT_STEPS: CheckoutStep[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function statusFor(index: number, current: number): CheckoutStepStatus {
  if (index < current) return 'complete';
  if (index === current) return 'current';
  return 'upcoming';
}

/** Circular step indicator built from tokenized size / color / border values. */
function StepIndicator({
  status,
  position,
}: {
  status: CheckoutStepStatus;
  position: number;
}) {
  const base: CSSProperties = {
    width: token.size.control.sm,
    height: token.size.control.sm,
    borderRadius: token.radius.pill,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transitionProperty: 'background, border-color, box-shadow',
    transitionDuration: token.duration.base,
    transitionTimingFunction: token.easing.standard,
  };

  const byStatus: Record<CheckoutStepStatus, CSSProperties> = {
    complete: {
      background: token.color.action.primary,
      border: `${token.borderWidth.thin} solid ${token.color.action.primary}`,
    },
    current: {
      background: token.color.bg.surface,
      border: `${token.borderWidth.thick} solid ${token.color.action.primary}`,
      boxShadow: token.shadow.focus,
    },
    upcoming: {
      background: token.color.bg.muted,
      border: `${token.borderWidth.thin} solid ${token.color.border.default}`,
    },
  };

  const numberColor: Record<CheckoutStepStatus, 'onAction' | 'primary' | 'muted'> = {
    complete: 'onAction',
    current: 'primary',
    upcoming: 'muted',
  };

  return (
    <span style={{ ...base, ...byStatus[status] }} aria-hidden="true">
      {status === 'complete' ? (
        <Text variant="label" color="onAction">
          ✓
        </Text>
      ) : (
        <Text variant="label" color={numberColor[status]}>
          {position}
        </Text>
      )}
    </span>
  );
}

/** Connector line between two steps; filled once the prior step is complete. */
function StepConnector({ filled }: { filled: boolean }) {
  const style: CSSProperties = {
    flex: 1,
    height: token.borderWidth.thick,
    minWidth: token.space.lg,
    background: filled ? token.color.action.primary : token.color.border.default,
    borderRadius: token.radius.pill,
    transitionProperty: 'background',
    transitionDuration: token.duration.base,
    transitionTimingFunction: token.easing.standard,
  };
  return <span style={style} aria-hidden="true" />;
}

export function CheckoutStepper({
  steps = DEFAULT_STEPS,
  currentStep = 0,
}: CheckoutStepperProps) {
  const total = steps.length;

  return (
    <Card aria-label="Checkout progress">
      <Stack direction="column" gap="md">
        <Stack direction="row" align="center" gap="sm">
          <Text variant="title" color="primary">
            Checkout
          </Text>
          <Badge tone="info">
            Step {Math.min(currentStep + 1, total)} of {total}
          </Badge>
        </Stack>

        <Stack
          direction="row"
          align="center"
          gap="sm"
          role="list"
          aria-label="Checkout steps"
        >
          {steps.map((step, index) => {
            const status = statusFor(index, currentStep);
            const isLast = index === total - 1;
            const labelColor =
              status === 'upcoming'
                ? 'muted'
                : status === 'complete'
                  ? 'secondary'
                  : 'primary';

            return (
              <Stack
                key={step.id}
                direction="row"
                align="center"
                gap="sm"
                role="listitem"
                aria-current={status === 'current' ? 'step' : undefined}
                style={isLast ? undefined : { flex: 1 }}
              >
                <Stack direction="row" align="center" gap="sm">
                  <StepIndicator status={status} position={index + 1} />
                  <Text variant="label" color={labelColor}>
                    {step.label}
                  </Text>
                </Stack>
                {!isLast && <StepConnector filled={index < currentStep} />}
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}

export default CheckoutStepper;
