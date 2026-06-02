import { Accordion, Card, Stack, Text } from '@/ds';

/**
 * FaqSection — a "Frequently asked questions" heading followed by three
 * collapsible question/answer items.
 *
 * Consistency notes (Aperture DS):
 * - The collapsible items REUSE the registered <Accordion> [NEW] from '@/ds';
 *   disclosure is never hand-rolled as a <div> + onClick + inline padding.
 * - Type is set ONLY via <Text variant> (heading for the section title,
 *   title is owned by Accordion's header, body for the answers).
 * - Spacing is set ONLY via <Stack gap> — no margins, no raw padding.
 * - The bounded surface is the registered <Card>; no inline border/radius/shadow.
 * - No raw color/px/rem/shadow literals appear anywhere in this file.
 */

interface FaqItem {
  /** The question shown in the Accordion header row. */
  question: string;
  /** The answer revealed when the item is expanded. */
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Aperture?',
    answer:
      'Aperture is a workspace for capturing, organizing, and sharing your team’s visual work in one place, with everything kept in sync as it changes.',
  },
  {
    question: 'Can I invite my whole team?',
    answer:
      'Yes. Invite unlimited collaborators on every paid plan, assign roles, and manage access from a single shared dashboard.',
  },
  {
    question: 'How does billing work?',
    answer:
      'You’re billed per active member each month. Upgrade, downgrade, or cancel at any time — changes take effect on your next cycle with no hidden fees.',
  },
];

export interface FaqSectionProps {
  /** Section heading. Defaults to the canonical FAQ title. */
  heading?: string;
  /** The question/answer pairs to render as collapsible items. */
  items?: FaqItem[];
}

export function FaqSection({
  heading = 'Frequently asked questions',
  items = FAQ_ITEMS,
}: FaqSectionProps) {
  return (
    <Card>
      <Stack direction="column" gap="lg" align="stretch">
        <Text variant="heading" color="primary">
          {heading}
        </Text>

        <Stack direction="column" gap="sm" align="stretch">
          {items.map((item, index) => (
            <Accordion
              key={item.question}
              title={item.question}
              defaultOpen={index === 0}
            >
              <Text variant="body" color="secondary">
                {item.answer}
              </Text>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default FaqSection;
