import { Stack, Box, Text, Icon, Divider, token } from '@/ds';

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

interface StepDefinition {
  id: CheckoutStep;
  label: string;
}

const STEPS: StepDefinition[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

type StepState = 'complete' | 'current' | 'upcoming';

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'complete';
  if (index === currentIndex) return 'current';
  return 'upcoming';
}

interface StepIndicatorProps {
  index: number;
  label: string;
  state: StepState;
}

function StepIndicator({ index, label, state }: StepIndicatorProps) {
  const circleBackground =
    state === 'complete'
      ? token.color.accent.default
      : state === 'current'
        ? token.color.accent.subtle
        : token.color.surface.muted;

  const circleBorder =
    state === 'upcoming' ? token.color.border.default : token.color.accent.default;

  const labelColor =
    state === 'upcoming' ? token.color.text.muted : token.color.text.default;

  return (
    <Stack direction="row" gap="sm" align="center">
      <Box
        width={token.size.lg}
        height={token.size.lg}
        radius={token.radius.full}
        background={circleBackground}
        borderColor={circleBorder}
        borderWidth={token.border.width.thin}
        padding={token.space.none}
      >
        <Stack align="center" justify="center" gap="none">
          {state === 'complete' ? (
            <Icon name="check" size={token.size.sm} color={token.color.text.inverse} />
          ) : (
            <Text
              variant="label"
              color={
                state === 'current'
                  ? token.color.accent.default
                  : token.color.text.muted
              }
            >
              {index + 1}
            </Text>
          )}
        </Stack>
      </Box>
      <Text
        variant={state === 'current' ? 'labelStrong' : 'label'}
        color={labelColor}
      >
        {label}
      </Text>
    </Stack>
  );
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <Box
      as="nav"
      aria-label="Checkout progress"
      padding={token.space.lg}
      background={token.color.surface.default}
      borderColor={token.color.border.subtle}
      borderWidth={token.border.width.thin}
      radius={token.radius.lg}
    >
      <Stack direction="row" gap="md" align="center" justify="between">
        {STEPS.map((step, index) => {
          const state = getStepState(index, currentIndex);
          const isLast = index === STEPS.length - 1;

          return (
            <Stack
              key={step.id}
              direction="row"
              gap="md"
              align="center"
              grow={isLast ? 0 : 1}
            >
              <StepIndicator index={index} label={step.label} state={state} />
              {!isLast && (
                <Box grow={1}>
                  <Divider
                    orientation="horizontal"
                    color={
                      index < currentIndex
                        ? token.color.accent.default
                        : token.color.border.subtle
                    }
                  />
                </Box>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

export default CheckoutStepper;
