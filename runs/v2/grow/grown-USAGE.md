# Aperture DS (GROWN) — web usage. Import from '@/ds'. Style via token.* / <Text variant>. No raw literals.

## Components (includes newly-registered ones — REUSE them)
- <Button> — variant: primary|secondary|danger|ghost; size: sm|md|lg  · Triggers an action. NOT for navigation — use Link for that.
- <Card> — variant: default|elevated  · A bounded surface that groups related content with consistent inset, radius, and elevation.
- <Badge> — tone: neutral|success|warning|danger|info  · A small inline status/label pill.
- <TextField> — state: default|error|disabled  · A single-line text input with consistent height, radius, border, and focus ring.
- <Text> — variant: display|heading|title|body|label|caption; color: primary|secondary|muted|onAction  · Renders text at a registered typography preset. The only sanctioned way to set type.
- <Stack> — direction: row|column; gap: none|xs|sm|md|lg|xl; align: start|center|end|stretch  · Flex layout primitive whose gap MUST be a spacing token — the main defense against ad-hoc margins.
- <Switch> — size: sm|md  · Binary on/off control with token-driven track/thumb colors.
- <Avatar> — size: sm|md|lg  · Circular user image/initials at registered sizes.
- <Accordion> — size: lg|md|sm  · A single collapsible disclosure section whose header row toggles a body region; use to progressively reveal one optional block of content. NOT for navigation, tabs, or modals, and NOT for a static grouping surface (use Card).  [NEW]
- <Breadcrumb> — size: lg|md|sm; separator: chevron|slash  · Shows the user's position in a navigational hierarchy as a row of ancestor links ending in the current page; NOT for primary site navigation, tabs, or stepping through a linear wizard.  [NEW]
- <SegmentedControl> — size: md|sm; radius: md|pill  · Horizontal single-select group of 2-4 equal-width segments for mutually exclusive option/view switching; NOT for route navigation, binary on/off (use Switch), multi-select, or triggering actions (use Button).  [NEW]
- <StatSparkline> — size: lg|md|sm; tone: danger|down|neutral|success|up; variant: bar|line|primary|secondary  · A compact, axis-less inline trend line/bars summarising one stat's direction at a glance; NOT a full readable chart with axes/labels and NOT a static status pill (use Badge).  [NEW]
