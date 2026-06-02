import {
  Stack,
  Inline,
  Text,
  Icon,
  Box,
  Divider,
  VisuallyHidden,
  token,
} from '@/ds';

export type CheckoutStepId = 'cart' | 'shipping' | 'payment' | 'review';

interface CheckoutStepperProps {
  /** The id of the step the user is currently on. */
  currentStep?: CheckoutStepId;
  /** Optional click handler for navigating back to a completed step. */
  onStepSelect?: (step: CheckoutStepId) => void;
}

interface StepDef {
  id: CheckoutStepId;
  label: string;
}

const STEPS: StepDef[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

type StepState = 'complete' | 'current' | 'upcoming';

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'complete';
  if (index === currentIndex) return 'current';
  return 'upcoming';
}

function StepIndicator({
  state,
  position,
}: {
  state: StepState;
  position: number;
}) {
  const background =
    state === 'upcoming' ? token.color.surface.subtle : token.color.accent.default;
  const foreground =
    state === 'upcoming'
      ? token.color.text.muted
      : token.color.text.onAccent;
  const borderColor =
    state === 'current' ? token.color.accent.emphasis : token.color.border.subtle;

  return (
    <Box
      width={token.size.icon.lg}
      height={token.size.icon.lg}
      borderRadius={token.radius.full}
      background={background}
      borderWidth={token.border.width.thin}
      borderColor={borderColor}
      align="center"
      justify="center"
    >
      {state === 'complete' ? (
        <Icon name="check" size="sm" color={foreground} />
      ) : (
        <Text variant="labelSmall" color={foreground}>
          {position}
        </Text>
      )}
    </Box>
  );
}

function Step({
  step,
  state,
  position,
  onSelect,
}: {
  step: StepDef;
  state: StepState;
  position: number;
  onSelect?: (step: CheckoutStepId) => void;
}) {
  const isInteractive = state === 'complete' && Boolean(onSelect);
  const labelColor =
    state === 'current'
      ? token.color.text.default
      : state === 'complete'
        ? token.color.text.subtle
        : token.color.text.muted;

  return (
    <Inline
      as={isInteractive ? 'button' : 'div'}
      gap="sm"
      align="center"
      onClick={isInteractive ? () => onSelect?.(step.id) : undefined}
      aria-current={state === 'current' ? 'step' : undefined}
    >
      <StepIndicator state={state} position={position} />
      <Text
        variant={state === 'current' ? 'labelMedium' : 'bodySmall'}
        color={labelColor}
      >
        {step.label}
      </Text>
      {state === 'complete' ? (
        <VisuallyHidden>(completed)</VisuallyHidden>
      ) : null}
    </Inline>
  );
}

export function CheckoutStepper({
  currentStep = 'cart',
  onStepSelect,
}: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <Box
      as="nav"
      aria-label="Checkout progress"
      paddingX={token.space.lg}
      paddingY={token.space.md}
      background={token.color.surface.default}
      borderColor={token.color.border.subtle}
      borderWidth={token.border.width.thin}
    >
      <Inline gap="md" align="center" justify="between">
        {STEPS.map((step, index) => {
          const state = getStepState(index, safeIndex);
          const isLast = index === STEPS.length - 1;

          return (
            <Inline key={step.id} gap="md" align="center" grow={!isLast}>
              <Step
                step={step}
                state={state}
                position={index + 1}
                onSelect={onStepSelect}
              />
              {!isLast ? (
                <Box grow>
                  <Divider
                    orientation="horizontal"
                    color={
                      index < safeIndex
                        ? token.color.accent.default
                        : token.color.border.subtle
                    }
                  />
                </Box>
              ) : null}
            </Inline>
          );
        })}
      </Inline>
    </Box>
  );
}

export default CheckoutStepper;
