// Build an interactive REVIEW page: renders one live instance of each framework-built
// screen into labeled, commentable sections. You drop pin-comments on specific spots
// and add per-section notes; "Export feedback" downloads review-comments.json.
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DS = path.join(ROOT, 'reference', 'web', 'ds');
const OUT = path.join(ROOT, 'harness', 'review', 'dist');
fs.mkdirSync(OUT, { recursive: true });

// curated, review-fixed screens (addresses the v2 review comments)
const SCREENS = process.env.REVIEW_SRC || `${ROOT}/reference/web/screens`;
const SECTIONS = [
  { id: 'pricing-card', label: 'Pricing card', file: `${SCREENS}/PricingCard.tsx` },
  { id: "login-form", label: "Login form", file: `${SCREENS}/LoginForm.tsx` },
  { id: 'settings-row', label: 'Settings row', file: `${SCREENS}/SettingsRow.tsx` },
  { id: 'stat-card', label: 'Stat card', file: `${SCREENS}/StatCard.tsx` },
  { id: 'profile-header', label: 'Profile header', file: `${SCREENS}/ProfileHeader.tsx` },
  { id: 'notification-toast', label: 'Notification toast', file: `${SCREENS}/NotificationToast.tsx` },
].filter((s) => fs.existsSync(s.file));

let imports = '', cells = '';
SECTIONS.forEach((s, i) => {
  imports += `import * as M${i} from ${JSON.stringify(s.file)};\n`;
  cells += `  React.createElement(Section, { key: '${s.id}', id: '${s.id}', label: ${JSON.stringify(s.label)} }, React.createElement(Pick, { m: M${i} })),\n`;
});

const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
${imports}
class Boundary extends React.Component {
  constructor(p){ super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err){ return { err }; }
  render(){
    if (this.state.err) return React.createElement('div', { style: { color: '#b42318', background: '#fef3f2', border: '1px solid #fecdca', borderRadius: 8, padding: 12, font: '12px ui-monospace, monospace' } }, '⚠ render error (needs props or has a bug): ' + String(this.state.err.message));
    return this.props.children;
  }
}
// demo props so prop-driven screens (e.g. ProfileHeader needs name) still render
const DEMO = { name: 'Ada Lovelace', title: 'Ada Lovelace', role: 'Product Designer', user: { name: 'Ada Lovelace', role: 'Product Designer' } };
function Pick({ m }) {
  const C = m.default || Object.values(m).find(v => typeof v === 'function');
  if (!C) return React.createElement('div', null, '(no export)');
  return React.createElement(Boundary, null, React.createElement(C, DEMO));
}
function Section({ id, label, children }) {
  return React.createElement('section', { className: 'rv-section', 'data-review': id, 'data-label': label },
    React.createElement('div', { className: 'rv-head' }, React.createElement('span', { className: 'rv-label' }, label),
      React.createElement('span', { className: 'rv-count', 'data-count-for': id })),
    React.createElement('div', { className: 'rv-frame', 'data-frame-for': id }, children));
}
const App = () => React.createElement('div', { className: 'rv-grid' }, [
${cells}]);
createRoot(document.getElementById('root')).render(React.createElement(App));
`;
const entryPath = path.join(OUT, 'review-entry.jsx');
fs.writeFileSync(entryPath, entry);

await esbuild.build({
  entryPoints: [entryPath], bundle: true, outfile: path.join(OUT, 'review-bundle.js'),
  jsx: 'automatic', loader: { '.tsx': 'tsx', '.ts': 'ts' }, alias: { '@/ds': DS },
  nodePaths: [path.join(ROOT, 'harness', 'node_modules')], logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
});

const tokensCss = fs.readFileSync(path.join(DS, 'tokens.css'), 'utf8') + '\n' + fs.readFileSync(path.join(DS, 'motion.css'), 'utf8');
const overlay = fs.readFileSync(path.join(import.meta.dirname, 'overlay.js'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Aperture DS — design review</title>
<style>
${tokensCss}
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: var(--color-bg-canvas); color: var(--color-text-primary); }
.rv-topbar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: 16px; padding: 12px 20px; background: #fff; border-bottom: 1px solid var(--color-border-default); box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.rv-topbar h1 { font-size: 15px; margin: 0; font-weight: 600; }
.rv-topbar .rv-hint { font-size: 12px; color: var(--color-text-secondary); }
.rv-btn { font: 500 13px system-ui; padding: 7px 12px; border-radius: 8px; border: 1px solid var(--color-border-default); background: #fff; cursor: pointer; }
.rv-btn.primary { background: var(--color-action-primary); color: #fff; border-color: transparent; }
.rv-btn.active { background: var(--color-action-primary); color: #fff; border-color: transparent; }
.rv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; padding: 24px; align-items: start; }
.rv-section { background: #fff; border: 1px solid var(--color-border-default); border-radius: 14px; overflow: hidden; }
.rv-section.commented { outline: 2px solid var(--color-action-primary); }
.rv-head { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--color-border-default); background: var(--color-bg-canvas); }
.rv-label { font: 600 13px system-ui; }
.rv-count { font: 600 11px system-ui; color: #fff; background: var(--color-action-primary); border-radius: 999px; padding: 1px 8px; display: none; }
.rv-count.show { display: inline-block; }
.rv-frame { position: relative; padding: 28px; background: var(--color-bg-canvas); min-height: 80px; }
.commenting .rv-frame { cursor: crosshair; }
.commenting .rv-frame * { pointer-events: none; }
.rv-pin { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 999px; background: var(--color-action-primary); color: #fff; font: 700 11px system-ui; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,.3); cursor: pointer; z-index: 5; }
.rv-notes { padding: 12px 14px; border-top: 1px dashed var(--color-border-default); display: none; }
.rv-section.commented .rv-notes, .rv-notes.open { display: block; }
.rv-notes textarea { width: 100%; min-height: 48px; font: 13px system-ui; border: 1px solid var(--color-border-default); border-radius: 8px; padding: 8px; resize: vertical; }
.rv-pinlist { margin: 8px 0 0; padding: 0; list-style: none; }
.rv-pinitem { display: flex; gap: 8px; align-items: flex-start; margin: 6px 0; font: 12px system-ui; }
.rv-pinitem .n { flex: 0 0 18px; height: 18px; border-radius: 999px; background: var(--color-action-primary); color: #fff; font: 700 10px system-ui; display: flex; align-items: center; justify-content: center; }
.rv-pinitem input { flex: 1; font: 12px system-ui; border: 1px solid var(--color-border-default); border-radius: 6px; padding: 4px 6px; }
.rv-pinitem .del { border: none; background: none; color: var(--color-text-muted); cursor: pointer; }
</style></head>
<body>
<div class="rv-topbar">
  <h1>Aperture DS — design review</h1>
  <button class="rv-btn" id="rv-toggle">💬 Comment mode: OFF</button>
  <span class="rv-hint" id="rv-hint">Turn on comment mode, then click a spot on any design to pin a note. Or use the section notes box.</span>
  <span style="flex:1"></span>
  <span class="rv-hint" id="rv-total">0 comments</span>
  <button class="rv-btn" id="rv-clear">Clear all</button>
  <button class="rv-btn primary" id="rv-export">Export feedback ⬇</button>
</div>
<div id="root"></div>
<script src="./review-bundle.js"></script>
<script>${overlay}</script>
</body></html>`;
fs.writeFileSync(path.join(OUT, 'review.html'), html);
console.log('built review.html with', SECTIONS.length, 'sections:', SECTIONS.map((s) => s.id).join(', '));
