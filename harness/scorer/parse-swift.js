// SwiftUI parser: structural/regex analysis of modifier chains, classified
// against the resolved manifest. Pragmatic (no SwiftSyntax) but sufficient for
// token-ref-vs-literal, component reuse, and value clustering.

// read a balanced (...) starting at the index of '('
function readBalanced(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) return src.slice(openIdx + 1, i); }
  }
  return src.slice(openIdx + 1);
}

// find all `.<name>(` or `<name>(` calls; return [{args, index}]
function scanCalls(src, name, { dotted = true } = {}) {
  const out = [];
  const re = new RegExp((dotted ? '\\.' : '\\b') + name + '\\s*\\(', 'g');
  let m;
  while ((m = re.exec(src))) {
    const open = src.indexOf('(', m.index);
    if (open === -1) continue;
    out.push({ args: readBalanced(src, open), index: m.index });
  }
  return out;
}

const COLOR_LITERAL = /Color\s*\(|Color\.(red|blue|green|black|white|gray|grey|orange|pink|purple|yellow|mint|teal|indigo|cyan|brown|clear|primary|secondary)\b|(?<![\w.])\.(red|blue|green|black|white|gray|grey|orange|pink|purple|yellow|mint|teal|indigo|cyan|brown)\b|#[0-9a-fA-F]{6}/;
const NUM_LITERAL = /(?<![\w.])-?\d+(\.\d+)?(?![\w.])/;

function colorRefSymbol(arg, lk) {
  let m = arg.match(/Color\.ds[A-Z]\w*/) || arg.match(/(?<![A-Za-z.])\.ds[A-Z]\w*/);
  if (m) {
    const sym = m[0];
    const tok = lk.swiftSymbolToToken.get(sym) || lk.swiftSymbolToToken.get('Color' + sym) || lk.swiftSymbolToToken.get(sym.replace(/^Color/, ''));
    if (tok) return tok;
    // tolerate Color.dsX vs .dsX equivalence
    const bare = sym.replace(/^Color/, '');
    return lk.swiftSymbolToToken.get(bare) || lk.swiftSymbolToToken.get('Color' + bare) || null;
  }
  return null;
}
function scalarRefSymbol(arg, lk) {
  const m = arg.match(/DS\.(Spacing|Radius|Size|FontSize|BorderWidth)\.\w+/);
  if (m) return lk.swiftSymbolToToken.get(m[0]) || null;
  return null;
}
function fontRefSymbol(arg, lk) {
  const m = arg.match(/(?:Font)?\.ds(Display|Heading|Title|Body|Label|Caption)\b/);
  if (m) {
    const preset = 'type.' + m[1].toLowerCase();
    return lk.idToToken.get(preset) || null;
  }
  return null;
}

export function parseSwift(code, lk) {
  // strip comments to avoid false hits
  const src = code.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = [];
  const reused = [];
  const missed = [];
  const componentsUsed = new Set();
  const tokensUsed = new Set();

  const pushDecl = (family, arg) => {
    // classify
    let tok = null, mismatch = false;
    if (family === 'color') tok = colorRefSymbol(arg, lk);
    else if (family === 'typography') tok = fontRefSymbol(arg, lk);
    else tok = scalarRefSymbol(arg, lk);
    if (tok) {
      const dimOk = family === 'color' ? tok.type === 'color'
        : family === 'typography' ? tok.dimension === 'typography'
        : family === 'size' ? tok.dimension === 'size'
        : tok.dimension === family;
      if (dimOk) { decls.push({ family, kind: 'ref', tokenId: tok.id, value: tok.canon ?? tok.value }); tokensUsed.add(tok.id); return; }
      mismatch = true;
    }
    // literal?
    if (family === 'color') {
      if (COLOR_LITERAL.test(arg)) decls.push({ family, kind: 'literal', value: (arg.match(/#[0-9a-fA-F]{6}/) || [arg.trim().slice(0, 24)])[0], mismatch });
      // else: arg is a non-color view (e.g. RoundedRectangle) -> not a color decl, skip
    } else if (family === 'typography') {
      if (/\.system\s*\(\s*size:/.test(arg) || /\.(body|title|headline|subheadline|caption|caption2|callout|footnote|largeTitle|title2|title3)\b/.test(arg)) {
        decls.push({ family, kind: 'literal', value: (arg.match(/size:\s*(\d+)/) || [, 'sys'])[1], mismatch });
      }
    } else { // dimension families
      const nm = arg.match(NUM_LITERAL);
      if (nm) decls.push({ family, kind: 'literal', value: nm[0], mismatch });
    }
  };

  // ---- styleable modifiers ----
  for (const c of scanCalls(src, 'padding')) { if (c.args.trim() !== '') pushDecl('spacing', c.args); }
  for (const c of scanCalls(src, 'cornerRadius')) pushDecl('radius', c.args);
  for (const c of scanCalls(src, 'clipShape')) { const m = c.args.match(/cornerRadius:\s*([^,)]+)/); if (m) pushDecl('radius', m[1]); }
  for (const c of scanCalls(src, 'frame')) {
    const h = c.args.match(/height:\s*([^,)]+)/); const w = c.args.match(/width:\s*([^,)]+)/);
    for (const dim of [h, w]) { if (dim && /DS\.Size|[0-9]/.test(dim[1]) && !/infinity/.test(dim[1])) pushDecl('size', dim[1]); }
  }
  for (const c of scanCalls(src, 'font')) pushDecl('typography', c.args);
  for (const c of scanCalls(src, 'dsType')) decls.push({ family: 'typography', kind: 'ref', tokenId: 'type.' + (c.args.match(/\.(\w+)/) || [, 'body'])[1], value: null }) && tokensUsed.add('type.' + (c.args.match(/\.(\w+)/) || [, 'body'])[1]);
  for (const name of ['foregroundStyle', 'foregroundColor', 'tint', 'fill', 'stroke', 'border']) {
    for (const c of scanCalls(src, name)) pushDecl('color', c.args);
  }
  for (const c of scanCalls(src, 'background')) {
    const a = c.args.trim();
    if (/^Color|^\.ds|^\.(red|blue|green|black|white|gray|orange|pink|purple|yellow)\b/.test(a)) pushDecl('color', a);
    // else: a shape/material view background -> handled by card-clone heuristic below
  }
  for (const c of scanCalls(src, 'shadow')) {
    if (/dsShadow/.test(c.args)) decls.push({ family: 'shadow', kind: 'ref', tokenId: 'shadow.token', value: null });
    else if (/radius:|color:/.test(c.args)) decls.push({ family: 'shadow', kind: 'literal', value: 'inline' });
  }
  for (const c of scanCalls(src, 'dsShadow')) { decls.push({ family: 'shadow', kind: 'ref', tokenId: 'shadow.' + (c.args.match(/\.(\w+)/) || [, 'md'])[1] }); tokensUsed.add('shadow.' + (c.args.match(/\.(\w+)/) || [, 'md'])[1]); }

  // ---- component reuse ----
  for (const [ctor] of lk.swiftConstructs) {
    const isModifier = ctor.startsWith('.');
    const calls = scanCalls(src, ctor.replace(/^\./, ''), { dotted: isModifier });
    for (const c of calls) { reused.push(ctor); componentsUsed.add(ctor); }
  }
  // dsCard modifier
  for (const c of scanCalls(src, 'dsCard')) { reused.push('.dsCard'); componentsUsed.add('.dsCard'); }

  // ---- missed opportunities (clones) ----
  // native Button styled by hand
  for (const m of src.matchAll(/(?<!DS)\bButton\s*\(/g)) {
    const after = src.slice(m.index, m.index + 400);
    if (/\.dsButtonStyle|\.buttonStyle\s*\(\s*DS/.test(after)) { reused.push('DSButton(via style)'); componentsUsed.add('DSButton'); }
    else if (/\.(background|cornerRadius|padding)\s*\(/.test(after)) missed.push({ role: 'DSButton' });
  }
  // native TextField styled by hand
  for (const m of src.matchAll(/(?<!DS)\bTextField\s*\(/g)) {
    const after = src.slice(m.index, m.index + 300);
    if (/\.(background|overlay|cornerRadius)\s*\(/.test(after)) missed.push({ role: 'DSTextField' });
  }
  // card clone: background + cornerRadius/clipShape together, no dsCard
  if (!/\.dsCard\s*\(/.test(src)) {
    for (const m of src.matchAll(/\.background\s*\(/g)) {
      const after = src.slice(m.index, m.index + 200);
      if (/\.cornerRadius\s*\(|\.clipShape\s*\(\s*RoundedRectangle/.test(after)) missed.push({ role: 'dsCard' });
    }
  }
  // text clone
  for (const m of src.matchAll(/(?<!DS)\bText\s*\(/g)) {
    const after = src.slice(m.index, m.index + 200);
    if (/\.font\s*\(\s*\.system\s*\(\s*size:/.test(after)) missed.push({ role: 'DSText' });
  }
  // stack clone with literal spacing
  for (const m of src.matchAll(/\b(?:VStack|HStack)\s*\(\s*spacing:\s*(\d+(?:\.\d+)?)/g)) missed.push({ role: 'DSStack' });

  return { decls, reused, missed, componentsUsed, tokensUsed };
}
