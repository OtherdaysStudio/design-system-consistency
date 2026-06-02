// Generate a realistic LARGE design system (~150 components) so retrieval actually
// matters — at this scale the whole catalog no longer fits comfortably in a prompt,
// which is precisely the regime the framework's "retrieval beats stuffing" thesis is about.
// Reuses the canonical token section; synthesizes a broad component registry.
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest } from '../lib/manifest.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const base = loadManifest(path.join(ROOT, 'reference', 'design-system.json'));

// category -> [ [Name, ...intentKeywords] ]
const CATALOG = {
  form: [['TextField', 'input', 'text', 'field'], ['Textarea', 'multiline', 'input', 'notes'], ['Select', 'dropdown', 'options', 'choose'], ['Combobox', 'autocomplete', 'search', 'select'], ['Checkbox', 'check', 'boolean', 'agree'], ['CheckboxGroup', 'multi', 'select', 'options'], ['Radio', 'single', 'choice'], ['RadioGroup', 'options', 'single', 'choice'], ['Switch', 'toggle', 'on', 'off'], ['Slider', 'range', 'drag', 'value'], ['RangeSlider', 'min', 'max', 'range'], ['NumberInput', 'numeric', 'stepper', 'quantity'], ['PinInput', 'otp', 'code', 'verification'], ['DatePicker', 'calendar', 'date', 'schedule'], ['DateRangePicker', 'range', 'dates', 'period'], ['TimePicker', 'time', 'clock', 'hours'], ['ColorPicker', 'color', 'swatch', 'palette'], ['FileUpload', 'file', 'dropzone', 'attach'], ['Rating', 'stars', 'score', 'review'], ['TagInput', 'tags', 'chips', 'tokens'], ['Label', 'caption', 'field', 'name'], ['FormField', 'wrapper', 'label', 'error'], ['Fieldset', 'group', 'form', 'section'], ['SearchInput', 'search', 'query', 'find'], ['PasswordInput', 'password', 'secret', 'masked']],
  action: [['Button', 'action', 'submit', 'cta'], ['IconButton', 'icon', 'action', 'compact'], ['ButtonGroup', 'segmented', 'actions', 'group'], ['SplitButton', 'dropdown', 'action', 'menu'], ['ToggleButton', 'toggle', 'pressed', 'state'], ['FAB', 'floating', 'action', 'primary'], ['CopyButton', 'copy', 'clipboard', 'duplicate'], ['LinkButton', 'link', 'navigate', 'anchor']],
  navigation: [['Tabs', 'tab', 'switch', 'sections'], ['SegmentedControl', 'segmented', 'switcher', 'toggle'], ['Breadcrumb', 'trail', 'path', 'hierarchy'], ['Pagination', 'pages', 'next', 'prev'], ['Menu', 'dropdown', 'actions', 'list'], ['Navbar', 'header', 'top', 'navigation'], ['Sidebar', 'side', 'nav', 'drawer'], ['Stepper', 'wizard', 'steps', 'progress'], ['BottomNav', 'tabbar', 'mobile', 'bottom'], ['CommandPalette', 'command', 'search', 'shortcut'], ['Anchor', 'link', 'jump', 'section'], ['BackButton', 'back', 'return', 'previous']],
  dataDisplay: [['Card', 'panel', 'surface', 'container'], ['Table', 'rows', 'columns', 'grid'], ['DataGrid', 'spreadsheet', 'editable', 'table'], ['List', 'items', 'vertical', 'collection'], ['ListItem', 'row', 'entry', 'item'], ['Badge', 'tag', 'status', 'pill'], ['Tag', 'chip', 'label', 'keyword'], ['Avatar', 'profile', 'user', 'photo'], ['AvatarGroup', 'avatars', 'stack', 'team'], ['Stat', 'metric', 'kpi', 'number'], ['StatSparkline', 'sparkline', 'trend', 'mini'], ['Timeline', 'history', 'events', 'chronology'], ['Tree', 'hierarchy', 'nested', 'expand'], ['DescriptionList', 'keyvalue', 'details', 'pairs'], ['Code', 'snippet', 'monospace', 'inline'], ['CodeBlock', 'syntax', 'highlight', 'code'], ['Kbd', 'key', 'shortcut', 'keyboard'], ['Calendar', 'month', 'days', 'events'], ['Chart', 'graph', 'plot', 'visualization'], ['Map', 'location', 'geo', 'pins']],
  feedback: [['Alert', 'warning', 'error', 'notice'], ['Toast', 'notification', 'snackbar', 'transient'], ['Banner', 'announcement', 'top', 'message'], ['Callout', 'highlight', 'note', 'info'], ['Spinner', 'loading', 'busy', 'progress'], ['ProgressBar', 'progress', 'percent', 'loading'], ['CircularProgress', 'ring', 'progress', 'loading'], ['Skeleton', 'placeholder', 'loading', 'shimmer'], ['EmptyState', 'empty', 'nothing', 'placeholder'], ['InlineError', 'validation', 'field', 'error'], ['StatusDot', 'indicator', 'online', 'status']],
  overlay: [['Modal', 'dialog', 'popup', 'overlay'], ['Dialog', 'confirm', 'modal', 'prompt'], ['Drawer', 'panel', 'slide', 'side'], ['Sheet', 'bottom', 'mobile', 'tray'], ['Popover', 'floating', 'anchored', 'panel'], ['Tooltip', 'hint', 'hover', 'label'], ['HoverCard', 'preview', 'hover', 'card'], ['ContextMenu', 'rightclick', 'menu', 'actions'], ['Dropdown', 'menu', 'select', 'options'], ['Toast', 'notification', 'overlay', 'transient']],
  layout: [['Stack', 'flex', 'row', 'column'], ['Grid', 'columns', 'layout', 'responsive'], ['Container', 'wrapper', 'max-width', 'center'], ['Divider', 'separator', 'rule', 'line'], ['Spacer', 'gap', 'space', 'flex'], ['AspectRatio', 'ratio', 'media', 'box'], ['ScrollArea', 'scroll', 'overflow', 'container'], ['Center', 'middle', 'align', 'center'], ['Box', 'primitive', 'div', 'container'], ['Splitter', 'resizable', 'panes', 'split']],
  media: [['Image', 'picture', 'photo', 'img'], ['Icon', 'glyph', 'symbol', 'svg'], ['Video', 'player', 'media', 'clip'], ['Carousel', 'slider', 'gallery', 'slides'], ['Gallery', 'images', 'grid', 'photos'], ['Lightbox', 'zoom', 'fullscreen', 'image']],
  typography: [['Text', 'body', 'paragraph', 'copy'], ['Heading', 'title', 'header', 'h1'], ['Prose', 'article', 'richtext', 'content'], ['Blockquote', 'quote', 'citation', 'pullquote'], ['Link', 'anchor', 'href', 'navigate']],
  disclosure: [['Accordion', 'collapsible', 'expand', 'faq'], ['Collapsible', 'toggle', 'expand', 'hide'], ['Details', 'summary', 'expand', 'disclosure'], ['ReadMore', 'truncate', 'expand', 'clamp']],
};

const SIZE = { name: 'size', type: 'enum', values: ['sm', 'md', 'lg'] };
const components = [];
let seq = 0;
for (const [category, items] of Object.entries(CATALOG)) {
  for (const [name, ...kw] of items) {
    seq++;
    components.push({
      id: `lg-${String(seq).padStart(4, '0')}`,
      logicalId: name.toLowerCase(),
      platform: 'web',
      canonicalName: name,
      category,
      intentKeywords: [name.toLowerCase(), ...kw],
      purposeStatement: `${name} — ${category} component.`,
      variants: [SIZE],
      web: { importName: name, importPath: '@/ds' },
    });
  }
}

const large = {
  ...base,
  metadata: { ...base.metadata, name: 'Aperture DS (Large)', componentCount: components.length },
  components,
};
const outDir = path.join(ROOT, 'reference', 'large');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'design-system.large.json'), JSON.stringify(large, null, 2));
console.log(`Generated large DS: ${components.length} components across ${Object.keys(CATALOG).length} categories`);
