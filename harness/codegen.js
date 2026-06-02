// One manifest, two emitters. Reads reference/design-system.json and emits:
//   reference/web/ds/tokens.css   (CSS custom properties)
//   reference/web/ds/tokens.ts    (typed `token` accessor -> var(--…))
//   reference/web/ds/tailwind-theme.css (Tailwind v4 @theme, demonstration only)
//   reference/swiftui/DS/Tokens.swift (DS enum namespace + Color/Font extensions)
// plus reference/_resolved.json (token table the scorer consumes).
import fs from 'node:fs';
import path from 'node:path';
import {
  loadManifest, validate, buildResolved, buildIndices, cssVarFor,
} from './lib/manifest.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const MANIFEST = path.join(ROOT, 'reference', 'design-system.json');

const manifest = loadManifest(MANIFEST);
const errors = validate(manifest);
if (errors.length) {
  console.error('❌ Manifest validation failed:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
const { resolved } = buildResolved(manifest);
console.log(`✅ Manifest valid: ${resolved.size} tokens, ${manifest.components.length} components`);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const camel = (segs) => segs.map((s, i) => (i === 0 ? s : cap(s))).join('');

// ---- shadow assembly ----
function boxShadow(value) {
  // value: {offsetX, offsetY, blur, spread, color}
  return `${value.offsetX} ${value.offsetY} ${value.blur} ${value.spread} ${value.color}`;
}

// ---------- WEB: tokens.css ----------
const cssLines = [':root {'];
for (const t of resolved.values()) {
  if (t.type === 'typography') continue; // applied via <Text variant>
  if (t.type === 'shadow') {
    cssLines.push(`  ${cssVarFor(t.id)}: ${boxShadow(t.value)};`);
  } else if (typeof t.value === 'string') {
    cssLines.push(`  ${cssVarFor(t.id)}: ${t.value};`);
  }
}
cssLines.push('}');
// typography utility classes — larger presets are FLUID (mobile→desktop) per
// learnui.design font-size guidance (titles 28-40 mobile → 35-50 desktop). Body/
// label/caption stay fixed and ≥16px (the iOS input auto-zoom rule). Fluid formula
// interpolates between a 375px-mobile and 1280px-desktop viewport.
const FLUID = { 'type.title': [20, 24], 'type.heading': [28, 34], 'type.display': [34, 44], 'type.hero': [40, 56] };
const fluid = (min, max) => `clamp(${min}px, calc(${min}px + (${max} - ${min}) * ((100vw - 375px) / 905)), ${max}px)`;
cssLines.push('');
for (const t of resolved.values()) {
  if (t.type !== 'typography') continue;
  const cls = '.' + t.id.replace('.', '-'); // type.body -> .type-body
  const fz = FLUID[t.id] ? fluid(FLUID[t.id][0], FLUID[t.id][1]) : t.value.fontSize;
  cssLines.push(`${cls} { font-size: ${fz}; font-weight: ${t.value.fontWeight}; line-height: ${t.value.lineHeight}; }`);
}
const cssOut = cssLines.join('\n') + '\n';

// ---------- WEB: tokens.ts (typed accessor) ----------
function nestAccessor() {
  const tree = {};
  for (const t of resolved.values()) {
    if (t.type === 'typography' || t.type === 'shadow') continue;
    const segs = t.id.split('.');
    let node = tree;
    segs.forEach((s, i) => {
      if (i === segs.length - 1) node[s] = `var(${cssVarFor(t.id)})`;
      else node = (node[s] ||= {});
    });
  }
  // shadows under token.shadow.<name>
  for (const t of resolved.values()) {
    if (t.type !== 'shadow') continue;
    const segs = t.id.split('.');
    let node = tree;
    segs.forEach((s, i) => { if (i === segs.length - 1) node[s] = `var(${cssVarFor(t.id)})`; else node = (node[s] ||= {}); });
  }
  return tree;
}
const tsOut =
  '// AUTO-GENERATED from reference/design-system.json — do not edit by hand.\n' +
  '// Usage: style={{ background: token.color.action.primary, padding: token.space.md }}\n' +
  'export const token = ' + JSON.stringify(nestAccessor(), null, 2) + ' as const;\n' +
  '\nexport type TypographyVariant = "display" | "heading" | "title" | "body" | "label" | "caption";\n';

// ---------- WEB: tailwind v4 @theme (demonstration, unscored) ----------
const twLines = ['@theme {'];
for (const t of resolved.values()) {
  if (t.type === 'color') twLines.push(`  --color-${t.id.split('.').join('-')}: ${typeof t.value === 'string' ? t.value : ''};`);
}
twLines.push('}');
const twOut = '/* Demonstration emitter — not used by the scored harness. */\n' + twLines.join('\n') + '\n';

// ---------- SWIFT: Tokens.swift ----------
const sw = [];
sw.push('// AUTO-GENERATED from reference/design-system.json — do not edit by hand.');
sw.push('import SwiftUI', '');
sw.push('public enum DS {');
const groups = { Spacing: [], Radius: [], FontSize: [], BorderWidth: [] };
const sizeControl = [], sizeIcon = [];
for (const t of resolved.values()) {
  const g = t.id.split('.')[0];
  const seg = t.id.split('.');
  const num = String(t.value).replace('px', '');
  if (g === 'space') groups.Spacing.push(`        public static let ${seg[1]}: CGFloat = ${num}`);
  else if (g === 'radius') groups.Radius.push(`        public static let ${seg[1]}: CGFloat = ${num}`);
  else if (g === 'fontSize') groups.FontSize.push(`        public static let ${seg[1]}: CGFloat = ${num}`);
  else if (g === 'borderWidth') groups.BorderWidth.push(`        public static let ${seg[1]}: CGFloat = ${num}`);
  else if (g === 'size' && seg[1] === 'control') sizeControl.push(`        public static let control${cap(seg[2])}: CGFloat = ${num}`);
  else if (g === 'size' && seg[1] === 'icon') sizeIcon.push(`        public static let icon${cap(seg[2])}: CGFloat = ${num}`);
}
for (const [name, lines] of Object.entries(groups)) {
  sw.push(`    public enum ${name} {`, ...lines, '    }');
}
sw.push('    public enum Size {', ...sizeControl, ...sizeIcon, '    }');
sw.push('}', '');
// semantic colors -> Color extension (values inline; in a real app these are Asset Catalog sets)
sw.push('public extension Color {');
for (const t of resolved.values()) {
  if (t.tier !== 'semantic' || t.type !== 'color') continue;
  const name = 'ds' + t.id.split('.').slice(1).map(cap).join('');
  const hex = t.value.replace('#', '');
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
    sw.push(`    static let ${name} = Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)})  // ${t.id}`);
  }
}
sw.push('}', '');
// typography presets -> Font + view modifier
sw.push('public extension Font {');
for (const t of resolved.values()) {
  if (t.type !== 'typography') continue;
  const name = 'ds' + cap(t.id.split('.')[1]);
  const weightMap = { '400': '.regular', '500': '.medium', '600': '.semibold', '700': '.bold' };
  sw.push(`    static let ${name} = Font.system(size: ${String(t.value.fontSize).replace('px', '')}, weight: ${weightMap[String(t.value.fontWeight)] || '.regular'})`);
}
sw.push('}', '');
sw.push('public enum DSTypePreset { case display, heading, title, body, label, caption }');
sw.push('public extension View {');
sw.push('    func dsType(_ p: DSTypePreset) -> some View {');
sw.push('        let f: Font = switch p {');
sw.push('            case .display: .dsDisplay; case .heading: .dsHeading; case .title: .dsTitle;');
sw.push('            case .body: .dsBody; case .label: .dsLabel; case .caption: .dsCaption }');
sw.push('        return self.font(f)');
sw.push('    }');
sw.push('}');
const swOut = sw.join('\n') + '\n';

// ---------- write outputs ----------
const writes = [
  ['reference/web/ds/tokens.css', cssOut],
  ['reference/web/ds/tokens.ts', tsOut],
  ['reference/web/ds/tailwind-theme.css', twOut],
  ['reference/swiftui/DS/Tokens.swift', swOut],
];
for (const [rel, content] of writes) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  console.log('  wrote', rel);
}

// ---------- resolved.json for the scorer ----------
const resolvedExport = {
  generatedFrom: 'reference/design-system.json',
  tokens: [...resolved.values()].map((t) => ({
    id: t.id, tier: t.tier, type: t.type, dimension: t.dimension,
    value: t.value, canon: t.canon, cssVar: t.cssVar, swift: t.swift,
  })),
  components: manifest.components.map((c) => ({
    id: c.id, logicalId: c.logicalId, platform: c.platform, canonicalName: c.canonicalName,
    category: c.category, intentKeywords: c.intentKeywords,
    importName: c.web?.importName, importPath: c.web?.importPath,
    swiftConstruct: c.swift?.construct, swiftModifier: c.swift?.modifier,
  })),
  indices: buildIndices(manifest),
};
fs.writeFileSync(path.join(ROOT, 'reference', '_resolved.json'), JSON.stringify(resolvedExport, null, 2));
console.log('  wrote reference/_resolved.json');
console.log('✅ codegen complete');
