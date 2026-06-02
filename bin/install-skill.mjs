#!/usr/bin/env node
// One-command installer for the design-system-consistency skill.
//   npx github:OtherdaysStudio/design-system-consistency
// Copies the skill bundle (framework/) into the user's Claude Code skills dir.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'design-system-consistency';
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const src = path.join(repoRoot, 'framework');

// --target lets you install into a project (.claude/skills) instead of the user dir
const arg = process.argv.find((a) => a.startsWith('--target='));
const baseSkillsDir = arg
  ? path.resolve(arg.split('=')[1], '.claude', 'skills')
  : path.join(os.homedir(), '.claude', 'skills');
const dest = path.join(baseSkillsDir, SKILL_NAME);

if (!fs.existsSync(path.join(src, 'SKILL.md'))) {
  console.error(`❌ Could not find the skill source at ${src}/SKILL.md`);
  process.exit(1);
}

try {
  fs.mkdirSync(baseSkillsDir, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  // strip any OS cruft that may have come along
  for (const f of fs.readdirSync(dest, { recursive: true })) {
    if (path.basename(String(f)) === '.DS_Store') fs.rmSync(path.join(dest, String(f)), { force: true });
  }
  console.log(`\n✅ Installed "${SKILL_NAME}" skill → ${dest}`);
  console.log('   Start a new Claude Code session to discover it (it triggers on any UI build/style/audit).\n');
} catch (e) {
  console.error(`❌ Install failed: ${e.message}`);
  process.exit(1);
}
