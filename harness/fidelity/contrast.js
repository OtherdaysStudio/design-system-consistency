// Deterministic fidelity gate #1: WCAG contrast. A high consistency score says you
// reused the system's colors — it does NOT say those colors are legible. This verifies
// the DS's own accessibility claims (the "$description: …AA on onAction" annotations)
// AND the implied foreground/background pairings, with real WCAG 2.1 contrast math.
import path from 'node:path';
import { loadManifest, buildResolved } from '../lib/manifest.js';

function lum(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(fg, bg) {
  const a = lum(fg), b = lum(bg);
  return +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05))).toFixed(2);
}

export function checkContrast(manifest) {
  const { resolved } = buildResolved(manifest);
  const val = (id) => resolved.get(id)?.value;
  const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

  // pairs to verify: foreground role on each plausible background role
  const PAIRS = [
    ['color.text.primary', 'color.bg.surface', 4.5, 'body text on surface'],
    ['color.text.primary', 'color.bg.canvas', 4.5, 'body text on canvas'],
    ['color.text.primary', 'color.bg.muted', 4.5, 'body text on muted'],
    ['color.text.secondary', 'color.bg.surface', 4.5, 'secondary text on surface'],
    ['color.text.onAction', 'color.action.primary', 4.5, 'label on primary button'],
    ['color.text.onAction', 'color.action.danger', 4.5, 'label on danger button'],
    ['color.status.success', 'color.status.successBg', 3.0, 'success fg on success tint (large/icon)'],
    ['color.status.danger', 'color.status.dangerBg', 3.0, 'danger fg on danger tint'],
    ['color.status.warning', 'color.status.warningBg', 3.0, 'warning fg on warning tint'],
    ['color.status.info', 'color.status.infoBg', 3.0, 'info fg on info tint'],
    ['color.text.secondary', 'color.bg.canvas', 4.5, 'secondary text on canvas'],
  ];

  const results = [];
  for (const [fgId, bgId, min, label] of PAIRS) {
    const fg = val(fgId), bg = val(bgId);
    if (!isHex(fg) || !isHex(bg)) continue;
    const ratio = contrastRatio(fg, bg);
    results.push({ label, fg: fgId, bg: bgId, ratio, min, pass: ratio >= min, level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA-large' : 'fail' });
  }
  const failures = results.filter((r) => !r.pass);
  return { results, failures, passRate: +(100 * (results.length - failures.length) / results.length).toFixed(1) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ROOT = path.resolve(import.meta.dirname, '..', '..');
  const manifest = loadManifest(path.join(ROOT, 'reference', 'design-system.json'));
  const { results, failures, passRate } = checkContrast(manifest);
  console.log('WCAG contrast verification of Aperture DS token pairings:\n');
  for (const r of results) console.log(`  ${r.pass ? '✅' : '❌'} ${r.ratio.toFixed(2)}:1 (${r.level})  ${r.label}  [need ≥${r.min}]`);
  console.log(`\npass rate: ${passRate}%  (${failures.length} failures)`);
  if (process.argv.includes('--gate') && failures.length) { console.error('\n❌ contrast gate FAILED — fix token pairings or relax the claim'); process.exit(1); }
}
