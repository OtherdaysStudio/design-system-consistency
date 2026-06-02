import { Stepper, Stack, Box, Text, token } from '@/ds';

type CheckoutStep = {
  id: string;
  label: string;
  description: string;
};

const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 'cart', label: 'Cart', description: 'Review items' },
  { id: 'shipping', label: 'Shipping', description: 'Delivery details' },
  { id: 'payment', label: 'Payment', description: 'Billing info' },
  { id: 'review', label: 'Review', description: 'Confirm order' },
];

export type CheckoutStepperProps = {
  activeStep?: number;
};

export function CheckoutStepper({ activeStep = 2 }: CheckoutStepperProps) {
  const current = CHECKOUT_STEPS[activeStep] ?? CHECKOUT_STEPS[0];

  return (
    <Box
      as="header"
      padding={token.space.lg}
      background={token.color.surface.raised}
      borderColor={token.color.border.subtle}
      borderWidth={token.border.width.thin}
      borderRadius={token.radius.lg}
    >
      <Stack gap={token.space.md}>
        <Stack direction="horizontal" gap={token.space.xs} align="baseline">
          <Text variant="overline" color={token.color.text.muted}>
            Checkout
          </Text>
          <Text variant="caption" color={token.color.text.subtle}>
            Step {activeStep + 1} of {CHECKOUT_STEPS.length}
          </Text>
        </Stack>

        <Stepper activeStep={activeStep} size="md">
          {CHECKOUT_STEPS.map((step, index) => (
            <Stepper.Step
              key={step.id}
              completed={index < activeStep}
              active={index === activeStep}
            >
              <Stack gap={token.space.xxs}>
                <Text variant="label" color={token.color.text.primary}>
                  {step.label}
                </Text>
                <Text variant="caption" color={token.color.text.muted}>
                  {step.description}
                </Text>
              </Stack>
            </Stepper.Step>
          ))}
        </Stepper>

        <Text variant="bodySm" color={token.color.text.secondary}>
          {current.label}: {current.description}
        </Text>
      </Stack>
    </Box>
  );
}

export default CheckoutStepper;
