// Minimal MCP stdio server exposing the design system as a queryable retrieval layer,
// so ANY agent/tool (incl. Claude Code) can call query_manifest instead of being handed
// the whole catalog. Speaks JSON-RPC 2.0 over stdio with LSP-style Content-Length framing.
//
//   Claude Code:  claude mcp add design-system -- node harness/retrieval/mcp-server.js
//   Self-test:    node harness/retrieval/mcp-server.js --selftest
import path from 'node:path';
import { loadManifest } from '../lib/manifest.js';
import { rank, renderTopK } from './rank.js';
import { query as registryQuery } from '../registry/registry.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const MF = process.env.DS_MANIFEST || path.join(ROOT, 'reference', 'large', 'design-system.large.json');
const manifest = loadManifest(MF);

const TOOLS = [
  {
    name: 'query_manifest',
    description: 'Retrieve the design-system components most relevant to a UI intent (reuse-before-create). Returns ranked candidates + a reuse/create decision. Call this BEFORE building any component.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: { type: 'string', description: 'what you are about to build, in plain words' },
        k: { type: 'number', description: 'max candidates (default 6)' },
        platform: { type: 'string', enum: ['web', 'swift'] },
      },
      required: ['intent'],
    },
  },
];

function handle(req) {
  const { id, method, params } = req;
  if (method === 'initialize') {
    return { jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'design-system-consistency', version: '1.0.0' } } };
  }
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  if (method === 'tools/call' && params?.name === 'query_manifest') {
    const { intent, k = 6, platform } = params.arguments || {};
    const top = renderTopK(manifest, [intent], k);
    const decision = registryQuery(manifest, { intent, platform, k }).decision;
    const text = `${top.text}\n\nDECISION: ${decision.action}${decision.action === 'REUSE' ? ` <${top.names[0] || ''}>` : ` (${decision.reason})`}`;
    return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } };
  }
  if (method?.startsWith('notifications/')) return null; // no response to notifications
  return { jsonrpc: '2.0', id, error: { code: -32601, message: `method not found: ${method}` } };
}

// --- self-test (no stdio) ---
if (process.argv.includes('--selftest')) {
  const init = handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  const list = handle({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  const call = handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'query_manifest', arguments: { intent: 'accordion collapsible faq', k: 4 } } });
  const ok = init.result.serverInfo.name === 'design-system-consistency'
    && list.result.tools[0].name === 'query_manifest'
    && /Accordion/.test(call.result.content[0].text);
  console.log('initialize:', init.result.serverInfo.name);
  console.log('tools/list:', list.result.tools.map((t) => t.name).join(','));
  console.log('query_manifest("accordion collapsible faq"):\n' + call.result.content[0].text.split('\n').slice(0, 6).join('\n'));
  console.log(ok ? '\n✅ MCP server self-test passed' : '\n❌ self-test failed');
  process.exit(ok ? 0 : 1);
}

// --- stdio transport (Content-Length framed) ---
let buf = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headerEnd = buf.indexOf('\r\n\r\n');
    if (headerEnd === -1) return;
    const header = buf.slice(0, headerEnd).toString();
    const m = header.match(/Content-Length:\s*(\d+)/i);
    if (!m) { buf = buf.slice(headerEnd + 4); continue; }
    const len = parseInt(m[1], 10);
    const start = headerEnd + 4;
    if (buf.length < start + len) return;
    const body = buf.slice(start, start + len).toString();
    buf = buf.slice(start + len);
    let req; try { req = JSON.parse(body); } catch { continue; }
    const res = handle(req);
    if (res) {
      const out = JSON.stringify(res);
      process.stdout.write(`Content-Length: ${Buffer.byteLength(out)}\r\n\r\n${out}`);
    }
  }
});
