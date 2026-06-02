// Bundle the ACTUAL agent-generated web components against the real DS and emit a
// static gallery HTML — so we can screenshot independent agents' outputs side by side
// and see whether the measured convergence is visually real.
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DS = path.join(ROOT, 'reference', 'web', 'ds');
const OUT = path.join(ROOT, 'harness', 'render', 'dist');
fs.mkdirSync(OUT, { recursive: true });

const TASK = process.argv[2] || 'pricing-card';
const fwDir = path.join(ROOT, 'runs', 'run2', 'framework-web', TASK);
const baseDir = path.join(ROOT, 'runs', 'run1', 'baseline-web', TASK);

const list = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.tsx')).sort() : []);
const fw = list(fwDir), base = list(baseDir);

// Generate a gallery entry importing each file as a namespace (robust to named/default export).
let imports = '', fwCells = '', baseCells = '';
fw.forEach((f, i) => {
  imports += `import * as FW${i} from ${JSON.stringify(path.join(fwDir, f))};\n`;
  fwCells += `    <Cell key="fw${i}" label="agent ${i + 1}"><Pick m={FW${i}} /></Cell>\n`;
});
base.forEach((f, i) => {
  imports += `import * as BS${i} from ${JSON.stringify(path.join(baseDir, f))};\n`;
  baseCells += `    <Cell key="bs${i}" label="agent ${i + 1}"><Pick m={BS${i}} /></Cell>\n`;
});

const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
${imports}
function Pick({ m }) {
  const C = m.default || m.PricingCard || m.LoginForm || m.SettingsRow || m.StatCard || m.ProfileHeader || m.NotificationToast || Object.values(m).find(v => typeof v === 'function');
  try { return C ? React.createElement(C) : React.createElement('div', null, 'no export'); }
  catch (e) { return React.createElement('div', { style: { color: 'red', font: '12px monospace' } }, 'render error: ' + String(e.message)); }
}
function Cell({ label, children }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' } },
    React.createElement('div', { style: { font: '11px ui-monospace, monospace', color: '#6b7585', letterSpacing: '.04em' } }, label),
    React.createElement('div', null, children));
}
function Col({ title, subtitle, accent, children }) {
  return React.createElement('div', { style: { flex: 1, padding: 24, borderRadius: 16, background: '#f6f7f9', border: '1px solid #dde1e8' } },
    React.createElement('div', { style: { font: '600 18px system-ui', color: '#171b23' } }, title),
    React.createElement('div', { style: { font: '13px system-ui', color: '#6b7585', marginBottom: 20 } }, subtitle),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 } }, children));
}
const App = () => React.createElement('div', { style: { display: 'flex', gap: 24, padding: 28, alignItems: 'flex-start', fontFamily: 'system-ui' } },
  React.createElement(Col, { title: 'WITH framework', subtitle: '${fw.length} independent agents · same task · CR 100% · converge' }, ${JSON.stringify(null)} && null,
    [${fw.map((_, i) => `React.createElement(Cell, { key: 'fw${i}', label: 'agent ${i + 1}' }, React.createElement(Pick, { m: FW${i} }))`).join(',')}]),
  React.createElement(Col, { title: 'Baseline (cold AI)', subtitle: '${base.length} independent agents · same task · re-invented each time' },
    [${base.map((_, i) => `React.createElement(Cell, { key: 'bs${i}', label: 'agent ${i + 1}' }, React.createElement(Pick, { m: BS${i} }))`).join(',')}]));
createRoot(document.getElementById('root')).render(React.createElement(App));
`;

const entryPath = path.join(OUT, `entry-${TASK}.jsx`);
fs.writeFileSync(entryPath, entry);

await esbuild.build({
  entryPoints: [entryPath],
  bundle: true,
  outfile: path.join(OUT, `bundle-${TASK}.js`),
  jsx: 'automatic',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  alias: { '@/ds': DS },
  nodePaths: [path.join(ROOT, 'harness', 'node_modules')],
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
});

const tokensCss = fs.readFileSync(path.join(DS, 'tokens.css'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${tokensCss}
body { margin: 0; background: #ffffff; }
</style></head><body><div id="root"></div><script src="./bundle-${TASK}.js"></script></body></html>`;
fs.writeFileSync(path.join(OUT, `gallery-${TASK}.html`), html);
console.log('built', path.join(OUT, `gallery-${TASK}.html`), `(framework=${fw.length}, baseline=${base.length})`);
