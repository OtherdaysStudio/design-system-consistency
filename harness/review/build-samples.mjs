// Render a showcase of DS sample screens as one page (for desktop+mobile screenshots).
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DS = path.join(ROOT, 'reference', 'web', 'ds');
const SAMP = path.join(ROOT, 'reference', 'web', 'samples');
const OUT = path.join(ROOT, 'harness', 'review', 'dist');
fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = [
  ['Pricing', 'PricingTiers'],
  ['Dashboard stats', 'StatRow'],
  ['Sign up', 'SignUpCard'],
  ['Settings', 'SettingsPanel'],
  ['Team', 'TeamList'],
  ['Notifications', 'ToastStack'],
];

let imports = '', cells = '';
SECTIONS.forEach(([label, comp], i) => {
  imports += `import * as M${i} from ${JSON.stringify(path.join(SAMP, comp + '.tsx'))};\n`;
  cells += `  React.createElement('section', { key: '${comp}', className: 'sx-sec' },\n` +
    `    React.createElement('div', { className: 'sx-label' }, ${JSON.stringify(label)}),\n` +
    `    React.createElement(Pick, { m: M${i} })),\n`;
});

const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
${imports}
class B extends React.Component { constructor(p){super(p);this.state={e:null}} static getDerivedStateFromError(e){return {e}} render(){ return this.state.e ? React.createElement('div',{style:{color:'#b42318',font:'12px monospace'}}, String(this.state.e.message)) : this.props.children } }
function Pick({ m }) { const C = m.default || Object.values(m).find(v=>typeof v==='function'); return React.createElement(B,null,C?React.createElement(C):null); }
const App = () => React.createElement('div', { className: 'sx-page' }, [
${cells}]);
createRoot(document.getElementById('root')).render(React.createElement(App));
`;
const entryPath = path.join(OUT, 'samples-entry.jsx');
fs.writeFileSync(entryPath, entry);

await esbuild.build({
  entryPoints: [entryPath], bundle: true, outfile: path.join(OUT, 'samples-bundle.js'),
  jsx: 'automatic', loader: { '.tsx': 'tsx', '.ts': 'ts' }, alias: { '@/ds': DS },
  nodePaths: [path.join(ROOT, 'harness', 'node_modules')], logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
});

const tokensCss = fs.readFileSync(path.join(DS, 'tokens.css'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Aperture DS — samples</title>
<style>
${tokensCss}
* { box-sizing: border-box; }
body { margin: 0; background: var(--color-bg-canvas); font-family: system-ui, sans-serif; color: var(--color-text-primary); }
.sx-page { max-width: 920px; margin: 0 auto; padding: 28px 20px 64px; display: flex; flex-direction: column; gap: 40px; }
.sx-label { font: 600 12px ui-monospace, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 12px; }
</style></head><body><div id="root"></div><script src="./samples-bundle.js"></script></body></html>`;
fs.writeFileSync(path.join(OUT, 'samples.html'), html);
console.log('built samples.html with', SECTIONS.length, 'sample screens');
