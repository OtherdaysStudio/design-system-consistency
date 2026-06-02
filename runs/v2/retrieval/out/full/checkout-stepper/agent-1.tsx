import { Stepper, Container, Stack, Text, token } from '@/ds';

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export interface CheckoutStepperProps {
  current?: CheckoutStep;
}

export function CheckoutStepper({ current = 'cart' }: CheckoutStepperProps) {
  const activeIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <Container
      size="lg"
      style={{
        paddingBlock: token.space.lg,
        paddingInline: token.space.xl,
        backgroundColor: token.color.surface,
        borderBottom: `${token.border.width.thin} solid ${token.color.border}`,
      }}
    >
      <Stack direction="vertical" gap="sm">
        <Text variant="overline" color={token.color.textMuted}>
          Checkout
        </Text>
        <Stepper activeStep={activeIndex} size="md">
          {STEPS.map((step, index) => (
            <Stepper.Step
              key={step.id}
              index={index}
              completed={index < activeIndex}
              active={index === activeIndex}
            >
              <Stack direction="horizontal" gap="sm" align="center">
                <Text
                  variant={index === activeIndex ? 'labelStrong' : 'label'}
                  color={
                    index === activeIndex
                      ? token.color.textAccent
                      : index < activeIndex
                        ? token.color.text
                        : token.color.textMuted
                  }
                >
                  {step.label}
                </Text>
              </Stack>
            </Stepper.Step>
          ))}
        </Stepper>
      </Stack>
    </Container>
  );
}

export default CheckoutStepper;
