import { Accordion, Card, Stack, Text } from '@/ds';

/**
 * FaqSection — a "Frequently asked questions" block: a heading followed by a
 * vertical stack of collapsible question/answer disclosures.
 *
 * Composition only — reuses registered DS components:
 *  - <Card> as the bounded grouping surface.
 *  - <Text variant="heading"> for the section title (type set ONLY via Text).
 *  - <Accordion> (registered disclosure component) per question. Its body wraps
 *    the answer string in <Text variant="body"> internally, so answers are
 *    passed as plain children — no hand-rolled collapsible, no double Text.
 *  - <Stack gap> for all spacing between heading and items, and between items.
 *
 * No raw color / spacing / radius / font literals: every styleable value is
 * encoded by the components themselves via token.*.
 */

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Aperture?',
    answer:
      'Aperture is a web app for capturing, organizing, and sharing your photo libraries with collaborators in real time.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Aperture is free for individuals. Team plans add shared workspaces and advanced permissions, billed monthly per seat.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes. You can export your full library at any time as original-quality files plus a portable metadata bundle, with no lock-in.',
  },
];

export function FaqSection() {
  return (
    <Card variant="default">
      <Stack direction="column" gap="lg">
        <Text variant="heading" color="primary">
          Frequently asked questions
        </Text>
        <Stack direction="column" gap="sm">
          {FAQ_ITEMS.map((item) => (
            <Accordion key={item.question} title={item.question} size="md">
              {item.answer}
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
