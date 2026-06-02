// CLI: score a directory of generated UI outputs against the manifest.
//
// Expected layout:  <runsDir>/<condition>/<task>/<file>.(tsx|jsx|swift)
//   condition = e.g. "baseline" | "framework"
//   task      = e.g. "pricing-card"
//   file      = one agent's output (multiple files per task => CC across them)
//
// Usage: node score.js <runsDir> [--manifest reference/_resolved.json] [--json out.json]
import fs from 'node:fs';
import path from 'node:path';
import { parseWeb, buildLookups } from './parse-web.js';
import { parseSwift } from './parse-swift.js';
import { scoreTA, scoreCR, scoreVC, scoreCC, scoreComposite, featureSet } from './metrics.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (/\.(tsx|jsx|ts|swift)$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(full);
  }
  return out;
}

function platformOf(file) { return file.endsWith('.swift') ? 'swift' : 'web'; }

export function scoreRuns(runsDir, resolved) {
  const lk = buildLookups(resolved);
  const files = walkFiles(runsDir);
  // group by condition (first dir under runsDir) and task (second dir)
  const conditions = {};
  for (const f of files) {
    const rel = path.relative(runsDir, f).split(path.sep);
    const condition = rel[0] || 'default';
    const task = rel[1] || 'default';
    const platform = platformOf(f);
    const code = fs.readFileSync(f, 'utf8');
    const parsed = platform === 'swift' ? parseSwift(code, lk) : parseWeb(code, lk);
    parsed.file = path.relative(ROOT, f); parsed.task = task; parsed.platform = platform;
    ((conditions[condition] ||= {}).files ||= []).push(parsed);
  }

  const report = { conditions: {} };
  for (const [cond, data] of Object.entries(conditions)) {
    const allDecls = data.files.flatMap((p) => p.decls);
    const allReused = data.files.flatMap((p) => p.reused);
    const allMissed = data.files.flatMap((p) => p.missed);
    const ta = scoreTA(allDecls);
    const cr = scoreCR(allReused, allMissed);
    const vc = scoreVC(allDecls, lk.definedByDim);
    // CC: group by task, mean pairwise jaccard within task, then average across tasks
    const byTask = {};
    for (const p of data.files) (byTask[p.task] ||= []).push(featureSet(p));
    const ccPerTask = [];
    for (const [task, sets] of Object.entries(byTask)) {
      const r = scoreCC(sets);
      if (r.value != null) ccPerTask.push({ task, cc: r.value, runs: r.runs });
    }
    const ccAvg = ccPerTask.length ? ccPerTask.reduce((s, x) => s + x.cc, 0) / ccPerTask.length : null;
    const composite = scoreComposite({ TA: ta.value, CR: cr.value, VC: vc.value, CC: ccAvg });

    // per-file detail (for debugging failure modes)
    const perFile = data.files.map((p) => {
      const t = scoreTA(p.decls), c = scoreCR(p.reused, p.missed), v = scoreVC(p.decls, lk.definedByDim);
      return {
        file: p.file, task: p.task, platform: p.platform, error: p.error,
        TA: t.value == null ? null : +t.value.toFixed(1), taDetail: `${t.num}/${t.den}`,
        CR: c.value == null ? null : +c.value.toFixed(1), crDetail: `${c.reused} reused / ${c.missed} missed`,
        VC: v.value == null ? null : +(v.value * 100).toFixed(1),
        literals: p.decls.filter((d) => d.kind === 'literal').map((d) => `${d.family}:${d.value}`),
        missed: p.missed.map((m) => m.role),
      };
    });

    report.conditions[cond] = {
      files: data.files.length,
      TA: ta.value == null ? null : +ta.value.toFixed(2), taDetail: `${ta.num}/${ta.den} styled decls reference tokens`,
      CR: cr.value == null ? null : +cr.value.toFixed(2), crDetail: `${cr.reused} reused / ${cr.missed} missed`,
      VC: vc.value == null ? null : +(vc.value * 100).toFixed(2), vcPerDim: vc.perDim,
      CC: ccAvg == null ? null : +(ccAvg * 100).toFixed(2), ccPerTask,
      composite: composite.composite, tier: composite.tier, flags: composite.flags,
      perFile,
    };
  }
  return report;
}

function fmt(v) { return v == null ? ' n/a ' : String(v).padStart(6); }

function printReport(report) {
  const conds = Object.entries(report.conditions);
  console.log('\n┌─ Consistency Report ' + '─'.repeat(46));
  console.log('│ %-12s %6s %6s %6s %6s │ %8s  %s', 'condition', 'TA', 'CR', 'VC', 'CC', 'COMPOSITE', 'tier');
  console.log('│ ' + '─'.repeat(64));
  for (const [cond, r] of conds) {
    console.log('│ %-12s %s %s %s %s │ %7s%%  %s%s', cond, fmt(r.TA), fmt(r.CR), fmt(r.VC), fmt(r.CC),
      fmt(r.composite), r.tier, r.flags.length ? `  ⚠ low:${r.flags.join(',')}` : '');
  }
  console.log('└' + '─'.repeat(66));
  for (const [cond, r] of conds) {
    console.log(`\n[${cond}] ${r.taDetail}; ${r.crDetail}`);
    const offenders = r.perFile.filter((f) => (f.literals && f.literals.length) || (f.missed && f.missed.length) || f.error).slice(0, 12);
    for (const f of offenders) {
      const bits = [];
      if (f.error) bits.push(`PARSE ERROR: ${f.error}`);
      if (f.literals?.length) bits.push(`literals[${f.literals.length}]: ${f.literals.slice(0, 6).join(', ')}`);
      if (f.missed?.length) bits.push(`missed: ${f.missed.join(', ')}`);
      console.log(`   ${path.basename(path.dirname(f.file))}/${path.basename(f.file)}  →  ${bits.join(' | ')}`);
    }
  }
}

// ---- main ----
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const runsDir = path.resolve(args.find((a) => !a.startsWith('--')) || 'runs');
  const manifestArg = args.includes('--manifest') ? args[args.indexOf('--manifest') + 1] : path.join(ROOT, 'reference', '_resolved.json');
  const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
  const resolved = JSON.parse(fs.readFileSync(manifestArg, 'utf8'));
  const report = scoreRuns(runsDir, resolved);
  printReport(report);
  if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2)); console.log('\nwrote', jsonOut); }
}
