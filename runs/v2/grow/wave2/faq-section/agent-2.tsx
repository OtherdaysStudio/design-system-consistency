import { Accordion, Stack, Text } from '@/ds';

/**
 * FaqSection — a heading followed by a list of collapsible Q&A items.
 *
 * Composition-only screen: it reuses registered DS primitives and adds no new
 * styling decisions.
 *  - Heading type comes ONLY from <Text variant="heading">.
 *  - Every gap comes ONLY from <Stack gap> (spacing-token enum).
 *  - Each question/answer pair is the registered <Accordion>, which already
 *    encodes its surface, border, radius, chevron, and body typography from
 *    tokens — we do NOT hand-roll a disclosure widget.
 * No raw hex/px/rem/shadow literals appear anywhere; there is nothing left to
 * style by hand once the right components are reused.
 */

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is Aperture?',
    answer:
      'Aperture is a collaborative workspace for planning, capturing, and reviewing your team’s creative work in one place, so nothing gets lost between tools.',
  },
  {
    question: 'Can I invite my whole team?',
    answer:
      'Yes. Every plan includes unlimited collaborators — invite teammates by email and assign roles so everyone has the right level of access.',
  },
  {
    question: 'How does billing work?',
    answer:
      'You’re billed monthly or annually per active member. You can change plans or cancel at any time, and annual billing comes with two months free.',
  },
];

export function FaqSection() {
  return (
    <Stack direction="column" gap="lg" align="stretch">
      <Text variant="heading" color="primary">
        Frequently asked questions
      </Text>

      <Stack direction="column" gap="sm" align="stretch">
        {FAQ_ITEMS.map((item) => (
          <Accordion key={item.question} title={item.question} size="md">
            {item.answer}
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
}
