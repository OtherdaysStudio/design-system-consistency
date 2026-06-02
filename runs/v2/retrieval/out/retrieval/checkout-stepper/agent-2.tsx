import { Container, Stack, Stepper, Heading, Text, token } from '@/ds';

export interface CheckoutStepperProps {
  /** Zero-based index of the step the shopper is currently on. */
  currentStep?: number;
}

const STEPS = [
  { id: 'cart', label: 'Cart', description: 'Review items' },
  { id: 'shipping', label: 'Shipping', description: 'Delivery details' },
  { id: 'payment', label: 'Payment', description: 'Card & billing' },
  { id: 'review', label: 'Review', description: 'Confirm order' },
] as const;

export function CheckoutStepper({ currentStep = 2 }: CheckoutStepperProps) {
  const active = STEPS[currentStep] ?? STEPS[0];

  return (
    <Container
      size="lg"
      style={{
        backgroundColor: token.color.bg.surface,
        borderBottomWidth: token.borderWidth.thin,
        borderBottomStyle: 'solid',
        borderBottomColor: token.color.border.default,
        paddingTop: token.space.lg,
        paddingBottom: token.space.lg,
      }}
    >
      <Stack direction="column" gap="md">
        <Stack direction="row" justify="space-between" align="baseline" gap="md">
          <Heading level={1} variant="title">
            Checkout
          </Heading>
          <Text variant="caption" style={{ color: token.color.text.muted }}>
            {`Step ${currentStep + 1} of ${STEPS.length}`}
          </Text>
        </Stack>

        <Stepper
          size="md"
          activeStep={currentStep}
          steps={STEPS.map((step, index) => ({
            id: step.id,
            label: step.label,
            description: step.description,
            status:
              index < currentStep
                ? 'complete'
                : index === currentStep
                  ? 'current'
                  : 'upcoming',
          }))}
        />

        <Text variant="label" style={{ color: token.color.action.primary }}>
          {`Current: ${active.label}`}
        </Text>
      </Stack>
    </Container>
  );
}

export default CheckoutStepper;
