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

// Defensive: some agents wrap file contents in markdown fences. Strip them.
function stripFences(code) {
  let c = code.replace(/^﻿/, '');
  const fence = c.match(/^\s*```[a-zA-Z]*\n([\s\S]*?)\n```\s*$/);
  if (fence) return fence[1];
  // leading fence only
  c = c.replace(/^\s*```[a-zA-Z]*\n/, '').replace(/\n```\s*$/, '');
  return c;
}

function scoreFileList(filesParsed, lk, { detail = true, ccOverride = undefined } = {}) {
  const allDecls = filesParsed.flatMap((p) => p.decls);
  const allReused = filesParsed.flatMap((p) => p.reused);
  const allMissed = filesParsed.flatMap((p) => p.missed);
  const ta = scoreTA(allDecls);
  const cr = scoreCR(allReused, allMissed);
  const vc = scoreVC(allDecls, lk.definedByDim);
  // CC: group by task, mean pairwise jaccard within task, then average across tasks.
  // CC is computed per-stack only (cross-stack pooling can't converge: <Button> vs DSButton).
  const byTask = {};
  for (const p of filesParsed) (byTask[p.task] ||= []).push(featureSet(p));
  const ccPerTask = [];
  for (const [task, sets] of Object.entries(byTask)) {
    const r = scoreCC(sets);
    if (r.value != null) ccPerTask.push({ task, cc: +(r.value * 100).toFixed(1), runs: r.runs });
  }
  let ccAvg = ccPerTask.length ? ccPerTask.reduce((s, x) => s + x.cc, 0) / ccPerTask.length : null;
  if (ccOverride !== undefined) ccAvg = ccOverride;
  const composite = scoreComposite({ TA: ta.value, CR: cr.value, VC: vc.value, CC: ccAvg == null ? null : ccAvg / 100 });
  const out = {
    files: filesParsed.length,
    TA: ta.value == null ? null : +ta.value.toFixed(2), taDetail: `${ta.num}/${ta.den} styled decls reference tokens`,
    CR: cr.value == null ? null : +cr.value.toFixed(2), crDetail: `${cr.reused} reused / ${cr.missed} missed`,
    VC: vc.value == null ? null : +(vc.value * 100).toFixed(2), vcPerDim: vc.perDim,
    CC: ccAvg == null ? null : +ccAvg.toFixed(2), ccPerTask,
    composite: composite.composite, tier: composite.tier, flags: composite.flags,
  };
  if (detail) {
    out.perFile = filesParsed.map((p) => {
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
  }
  return out;
}

export function scoreRuns(runsDir, resolved) {
  const lk = buildLookups(resolved);
  const files = walkFiles(runsDir);
  const conditions = {};
  for (const f of files) {
    const rel = path.relative(runsDir, f).split(path.sep);
    const condition = rel[0] || 'default';
    const task = rel[1] || 'default';
    const platform = platformOf(f);
    const code = stripFences(fs.readFileSync(f, 'utf8'));
    const parsed = platform === 'swift' ? parseSwift(code, lk) : parseWeb(code, lk);
    parsed.file = path.relative(ROOT, f); parsed.task = task; parsed.platform = platform;
    ((conditions[condition] ||= {}).files ||= []).push(parsed);
  }

  const report = { conditions: {}, aggregate: {} };
  for (const [cond, data] of Object.entries(conditions)) {
    report.conditions[cond] = scoreFileList(data.files, lk);
  }
  // aggregate by base condition (strip trailing -web/-swift)
  const byBase = {};
  for (const [cond, data] of Object.entries(conditions)) {
    const base = cond.replace(/-(web|swift)$/, '');
    (byBase[base] ||= []).push(...data.files);
  }
  for (const [base, fileList] of Object.entries(byBase)) {
    // CC averaged across the constituent per-stack conditions (not pooled cross-stack)
    const stackCCs = Object.entries(report.conditions)
      .filter(([c]) => c.replace(/-(web|swift)$/, '') === base)
      .map(([, r]) => r.CC).filter((v) => v != null);
    const ccOverride = stackCCs.length ? +(stackCCs.reduce((s, v) => s + v, 0) / stackCCs.length).toFixed(2) : null;
    report.aggregate[base] = scoreFileList(fileList, lk, { detail: false, ccOverride });
  }
  return report;
}

const fmt = (v) => (v == null ? 'n/a' : String(v)).padStart(7);
const pad = (s, n) => String(s).padEnd(n);

function printReport(report) {
  const conds = Object.entries(report.conditions);
  console.log('\n' + '═'.repeat(78));
  console.log('  CONSISTENCY REPORT' + (report.runLabel ? `  —  ${report.runLabel}` : ''));
  console.log('═'.repeat(78));
  console.log('  ' + pad('condition', 18) + fmt('TA') + fmt('CR') + fmt('VC') + fmt('CC') + '   ' + fmt('COMPOSITE') + '  tier');
  console.log('  ' + '─'.repeat(74));
  for (const [cond, r] of conds) {
    console.log('  ' + pad(cond, 18) + fmt(r.TA) + fmt(r.CR) + fmt(r.VC) + fmt(r.CC) + '   ' + fmt(r.composite) + '  ' +
      r.tier + (r.flags.length ? `  ⚠ low:${r.flags.join(',')}` : ''));
  }
  if (report.aggregate) {
    console.log('  ' + '─'.repeat(74));
    for (const [cond, r] of Object.entries(report.aggregate)) {
      console.log('  ' + pad(cond + ' (both stacks)', 18) + fmt(r.TA) + fmt(r.CR) + fmt(r.VC) + fmt(r.CC) + '   ' + fmt(r.composite) + '  ' + r.tier);
    }
  }
  console.log('═'.repeat(78));
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

// Flat mode: score an entire directory tree as ONE unit (for a real repo CI gate).
export function scoreFlat(dir, resolved) {
  const lk = buildLookups(resolved);
  const files = walkFiles(dir).map((f) => {
    const code = stripFences(fs.readFileSync(f, 'utf8'));
    const parsed = platformOf(f) === 'swift' ? parseSwift(code, lk) : parseWeb(code, lk);
    parsed.file = path.relative(ROOT, f); parsed.task = path.basename(path.dirname(f)); parsed.platform = platformOf(f);
    return parsed;
  });
  return { files: files.length, ...scoreFileList(files, lk) };
}

// ---- main ----
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = path.resolve(args.find((a) => !a.startsWith('--')) || 'runs');
  const manifestArg = args.includes('--manifest') ? args[args.indexOf('--manifest') + 1] : path.join(ROOT, 'reference', '_resolved.json');
  const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
  const flat = args.includes('--flat');
  const gateIdx = args.indexOf('--gate');
  const gate = gateIdx >= 0 ? parseFloat(args[gateIdx + 1]) : null;
  const resolved = JSON.parse(fs.readFileSync(manifestArg, 'utf8'));

  if (flat || gate != null) {
    const r = scoreFlat(dir, resolved);
    console.log(`\nConsistency (flat) for ${path.relative(ROOT, dir) || dir}`);
    console.log(`  TA ${r.TA ?? 'n/a'}  CR ${r.CR ?? 'n/a'}  VC ${r.VC ?? 'n/a'}  →  COMPOSITE ${r.composite} (${r.tier})`);
    console.log(`  ${r.taDetail}; ${r.crDetail}`);
    if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(r, null, 2));
    if (gate != null) {
      if (r.composite == null || r.composite < gate) {
        console.error(`\n❌ consistency gate FAILED: composite ${r.composite} < ${gate}`);
        const hints = [];
        if (r.CR != null && r.CR < 100) hints.push('reuse registered components instead of hand-rolling (see "missed" below)');
        if (r.TA != null && r.TA < 100) hints.push('replace raw literals with tokens (e.g. padding:16px -> token.space.md / DS.Spacing.md)');
        for (const f of (r.perFile || [])) {
          if (f.literals?.length) console.error(`   ${f.file}: literals ${f.literals.slice(0, 5).join(', ')}`);
          if (f.missed?.length) console.error(`   ${f.file}: missed ${f.missed.join(', ')}`);
        }
        if (hints.length) console.error('\n   fix: ' + hints.join('\n        '));
        process.exit(1);
      }
      console.log(`\n✅ consistency gate PASSED: composite ${r.composite} ≥ ${gate}`);
    }
  } else {
    const report = scoreRuns(dir, resolved);
    printReport(report);
    if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2)); console.log('\nwrote', jsonOut); }
  }
}
