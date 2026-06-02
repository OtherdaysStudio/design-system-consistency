// Fixture-based validation of the scorer. Builds known-good (token/component-driven)
// and known-bad (hand-rolled literals) outputs and asserts the metrics separate them.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scoreRuns } from './score.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const resolved = JSON.parse(fs.readFileSync(path.join(ROOT, 'reference', '_resolved.json'), 'utf8'));

const FIX = {
  'good/pricing-card/a.tsx': `
import { Card, Stack, Text, Button, Badge } from '@/ds';
import { token } from '@/ds';
export function PricingCard() {
  return (
    <Card variant="elevated">
      <Stack direction="column" gap="md">
        <Badge tone="success">Popular</Badge>
        <Text variant="heading" color="primary">Pro</Text>
        <Text variant="body" color="secondary">For growing teams</Text>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: token.space.xs }}>
          <Text variant="display">$29</Text>
          <Text variant="caption" color="muted">/mo</Text>
        </div>
        <Button variant="primary" size="lg">Choose Pro</Button>
      </Stack>
    </Card>
  );
}`,
  // identical second run -> CC should be 1.0
  'good/pricing-card/b.tsx': null, // filled below = copy of a
  'good/settings-row/a.swift': `
import SwiftUI
struct SettingsRow: View {
  var body: some View {
    DSStack(.horizontal, gap: .md) {
      DSText("Notifications", .body)
      Spacer()
      DSBadge("On", tone: .success)
    }
    .padding(DS.Spacing.md)
    .dsCard()
  }
}`,
  'good/settings-row/b.swift': null,

  'bad/pricing-card/a.tsx': `
export function PricingCard() {
  return (
    <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '20px', border: '1px solid #e5e5e5' }}>
      <span style={{ background: '#e6f6ee', color: '#2fa46b', borderRadius: '999px', padding: '4px 8px', fontSize: '12px' }}>Popular</span>
      <h2 style={{ fontSize: '26px', fontWeight: 700 }}>Pro</h2>
      <p style={{ fontSize: '15px', color: '#666666' }}>For growing teams</p>
      <div style={{ display: 'flex', gap: '6px' }}>
        <span style={{ fontSize: '34px', fontWeight: 800 }}>$29</span>
        <span style={{ fontSize: '13px', color: '#999999' }}>/mo</span>
      </div>
      <button style={{ background: '#2f6df6', color: 'white', borderRadius: '10px', padding: '12px 20px', border: 'none', fontSize: '15px' }}>Choose Pro</button>
    </div>
  );
}`,
  'bad/pricing-card/b.tsx': `
export function PricingCard() {
  return (
    <section style={{ background: '#fefefe', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '18px' }}>
      <div style={{ background: '#eafaf0', color: '#22aa66', borderRadius: '99px', padding: '5px 9px', fontSize: '11px' }}>Popular</div>
      <div style={{ fontSize: '25px', fontWeight: 600 }}>Pro</div>
      <button style={{ background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '14px' }}>Choose</button>
    </section>
  );
}`,
  'bad/settings-row/a.swift': `
import SwiftUI
struct SettingsRow: View {
  var body: some View {
    HStack(spacing: 12) {
      Text("Notifications").font(.system(size: 16))
      Spacer()
      Text("On").font(.system(size: 12)).padding(6).background(Color.green).cornerRadius(8)
    }
    .padding(16)
    .background(Color.white)
    .cornerRadius(12)
  }
}`,
};
FIX['good/pricing-card/b.tsx'] = FIX['good/pricing-card/a.tsx'];
FIX['good/settings-row/b.swift'] = FIX['good/settings-row/a.swift'];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dc-scorer-'));
for (const [rel, content] of Object.entries(FIX)) {
  const abs = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
}

const report = scoreRuns(tmp, resolved);
const good = report.conditions.good;
const bad = report.conditions.bad;

const checks = [];
const assert = (name, cond, detail) => checks.push({ name, pass: !!cond, detail });

assert('good TA == 100', good.TA === 100, `TA=${good.TA}`);
assert('good CR == 100 (no clones)', good.CR === 100, `CR=${good.CR} (${good.crDetail})`);
assert('good VC == 100', good.VC === 100, `VC=${good.VC}`);
assert('good CC == 100 (identical runs converge)', good.CC === 100, `CC=${good.CC}`);
assert('good composite >= 99', good.composite >= 99, `composite=${good.composite}`);
assert('good has no flags', good.flags.length === 0, `flags=${good.flags}`);

assert('bad TA <= 10', bad.TA <= 10, `TA=${bad.TA}`);
assert('bad CR <= 20', bad.CR <= 20, `CR=${bad.CR} (${bad.crDetail})`);
assert('bad detects missed components', bad.crDetail.includes('missed') && bad.CR < 50, bad.crDetail);
assert('bad composite < 40 (poor)', bad.composite < 40, `composite=${bad.composite} tier=${bad.tier}`);
assert('contrast: good - bad >= 60', (good.composite - bad.composite) >= 60, `Δ=${(good.composite - bad.composite).toFixed(1)}`);

console.log('\n=== Scorer self-test ===');
for (const c of checks) console.log(`  ${c.pass ? '✅' : '❌'} ${c.name}  (${c.detail})`);
console.log('\nGood:', JSON.stringify({ TA: good.TA, CR: good.CR, VC: good.VC, CC: good.CC, composite: good.composite, tier: good.tier }));
console.log('Bad: ', JSON.stringify({ TA: bad.TA, CR: bad.CR, VC: bad.VC, CC: bad.CC, composite: bad.composite, tier: bad.tier }));

fs.rmSync(tmp, { recursive: true, force: true });
const failed = checks.filter((c) => !c.pass);
if (failed.length) { console.error(`\n❌ ${failed.length} check(s) failed`); process.exit(1); }
console.log('\n✅ All scorer self-tests passed');
