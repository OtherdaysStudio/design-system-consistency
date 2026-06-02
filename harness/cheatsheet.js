// Emit compact per-stack usage cheatsheets from the manifest — the artifact the
// protocol's STEP 1 (retrieve) hands to a generating agent. Kept small on purpose.
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest, buildResolved } from './lib/manifest.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const manifest = loadManifest(path.join(ROOT, 'reference', 'design-system.json'));
const { resolved } = buildResolved(manifest);

const variantsStr = (c) => (c.variants || []).map((v) => `${v.name}: ${(v.values || []).join('|')}`).join('; ');

function tokenIndex() {
  const byGroup = {};
  for (const t of resolved.values()) {
    if (t.tier === 'component') continue;
    const top = t.id.split('.')[0];
    (byGroup[top] ||= new Set()).add(t.id);
  }
  const lines = [];
  for (const [g, ids] of Object.entries(byGroup)) {
    lines.push(`- ${g}: ${[...ids].sort().join(', ')}`);
  }
  return lines.join('\n');
}

// WEB
const web = manifest.components.filter((c) => c.platform === 'web');
let webDoc = `# Aperture DS — Web usage (this IS your manifest query result)

Import every component AND the \`token\` helper from '@/ds'.
Style ONLY via the \`token\` accessor (e.g. token.color.action.primary, token.space.md) or <Text variant>.
NEVER write a raw hex / px / rem / rgba / box-shadow literal. Variants are fixed enums — no free sizes.

## Components (reuse these — do not hand-roll <div>/<button>/<span> equivalents)
${web.map((c) => `- <${c.canonicalName}> — ${variantsStr(c)}  · ${c.purposeStatement}`).join('\n')}

## token accessor — token.<path> === var(--…). Available token ids:
${tokenIndex()}

Typography is set ONLY with <Text variant="display|heading|title|body|label|caption" color="primary|secondary|muted|onAction">.
Layout spacing is set ONLY with <Stack direction gap align> (gap is a token enum), not a raw flex gap.
`;

// SWIFT
const sw = manifest.components.filter((c) => c.platform === 'swift');
let swiftDoc = `# Aperture DS — SwiftUI usage (this IS your manifest query result)

DS tokens are in scope (Tokens.swift): enum DS { Spacing, Radius, FontSize, Size, BorderWidth }, Color.ds* semantic colors, .dsType(_:) / Font.ds*, .dsShadow(_:).
Reference ONLY DS.* / Color.ds* / .dsType / .dsShadow. NEVER a raw number in .padding/.frame/.cornerRadius, NEVER Color.red/.blue/Color(hex:)/.font(.system(size:)). Variants are Swift enums.

## Components (reuse these — do not hand-roll styled native Button/TextField/VStack cards)
${sw.map((c) => `- ${c.swift?.construct || c.canonicalName} — ${variantsStr(c)}  · ${c.purposeStatement}`).join('\n')}

Examples:
  DSStack(.vertical, gap: .md) { DSText("Title", .title); DSText("Body", .body, color: .dsTextSecondary) }.dsCard(.elevated)
  DSButton("Save") { save() }.dsButtonStyle(.primary, .lg)
  DSBadge("+12%", tone: .success)
  DSTextField("Email", text: $email)
  DSToggle("Notifications", isOn: $on)
  DSAvatar(name: "Ada Lovelace", size: .md)

## token enums available:
DS.Spacing: none,xs,sm,md,lg,xl,xxl,xxxl   DS.Radius: sm,md,lg,pill   DS.FontSize: xs,sm,md,lg,xl,xxl
DS.Size: controlSm,controlMd,controlLg,iconSm,iconMd,iconLg   Color.ds*: ${[...resolved.values()].filter((t) => t.tier === 'semantic' && t.type === 'color').map((t) => t.swift[0]?.replace('Color.', '')).filter(Boolean).slice(0, 12).join(', ')}…
`;

fs.writeFileSync(path.join(ROOT, 'reference', 'web', 'USAGE.md'), webDoc);
fs.writeFileSync(path.join(ROOT, 'reference', 'swiftui', 'USAGE.md'), swiftDoc);
console.log('wrote reference/web/USAGE.md and reference/swiftui/USAGE.md');
