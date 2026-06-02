// Web (React/TSX) parser: extracts styled declarations + component usage from
// inline style objects and standalone CSS, classified against the resolved manifest.
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import postcss from 'postcss';
const traverse = _traverse.default || _traverse;

const FAMILY_OF_PROP = {
  color: 'color', backgroundColor: 'color', background: 'color', borderColor: 'color',
  borderTopColor: 'color', borderRightColor: 'color', borderBottomColor: 'color', borderLeftColor: 'color',
  outlineColor: 'color', fill: 'color', stroke: 'color', caretColor: 'color', textDecorationColor: 'color',
  padding: 'spacing', paddingTop: 'spacing', paddingRight: 'spacing', paddingBottom: 'spacing', paddingLeft: 'spacing',
  paddingBlock: 'spacing', paddingInline: 'spacing',
  margin: 'spacing', marginTop: 'spacing', marginRight: 'spacing', marginBottom: 'spacing', marginLeft: 'spacing',
  gap: 'spacing', rowGap: 'spacing', columnGap: 'spacing',
  borderRadius: 'radius', borderTopLeftRadius: 'radius', borderTopRightRadius: 'radius',
  borderBottomLeftRadius: 'radius', borderBottomRightRadius: 'radius',
  borderWidth: 'borderWidth',
  fontSize: 'typography', fontWeight: 'typography', lineHeight: 'typography', letterSpacing: 'typography',
  boxShadow: 'shadow',
};
// CSS (kebab) -> family, for standalone CSS parsing
const FAMILY_OF_CSS = {};
for (const [k, v] of Object.entries(FAMILY_OF_PROP)) FAMILY_OF_CSS[k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())] = v;

const EXCLUDED = new Set(['0', '0px', '0rem', 'auto', 'inherit', 'initial', 'unset', 'none', '100%', 'currentcolor', 'transparent', 'normal', 'fit-content', 'max-content', 'min-content']);

function familyMatches(family, token) {
  if (!token) return false;
  if (family === 'color') return token.type === 'color';
  if (family === 'spacing') return token.dimension === 'spacing';
  if (family === 'radius') return token.dimension === 'radius';
  if (family === 'borderWidth') return token.dimension === 'borderWidth';
  if (family === 'typography') return token.dimension === 'typography';
  if (family === 'shadow') return token.type === 'shadow';
  if (family === 'borderShorthand') return true;
  return false;
}

// Build lookups from resolved table once.
export function buildLookups(resolved) {
  const cssVarToToken = new Map();
  const idToToken = new Map();
  const swiftSymbolToToken = new Map();
  const definedByDim = {};
  for (const t of resolved.tokens) {
    cssVarToToken.set(t.cssVar, t);
    idToToken.set(t.id, t);
    for (const s of t.swift || []) swiftSymbolToToken.set(s, t);
    if (t.canon != null) (definedByDim[t.dimension] ||= new Set()).add(t.canon);
  }
  // typography "values" = the set of preset ids (display..caption)
  definedByDim.typography = new Set(resolved.tokens.filter((t) => t.type === 'typography').map((t) => t.id));
  const webComponents = new Map(); // importName -> comp
  const swiftConstructs = new Map();
  for (const c of resolved.components) {
    if (c.platform === 'web' && c.importName) webComponents.set(c.importName, c);
    if (c.platform === 'swift' && c.swiftConstruct) swiftConstructs.set(c.swiftConstruct.split('(')[0], c);
  }
  return { cssVarToToken, idToToken, swiftSymbolToToken, definedByDim, webComponents, swiftConstructs };
}

function memberPath(node) {
  // token.color.action.primary  OR  token['space']['md']
  const parts = [];
  let n = node;
  while (n && (n.type === 'MemberExpression')) {
    const prop = n.property;
    if (prop.type === 'Identifier') parts.unshift(prop.name);
    else if (prop.type === 'StringLiteral') parts.unshift(prop.value);
    else if (prop.type === 'NumericLiteral') parts.unshift(String(prop.value));
    else return null;
    n = n.object;
  }
  if (n && n.type === 'Identifier') parts.unshift(n.name);
  return parts; // e.g. ['token','color','action','primary']
}

function classifyValueNode(node, family, lk) {
  // returns {kind:'ref'|'literal'|'excluded'|'unknown', tokenId?, value?}
  if (!node) return { kind: 'unknown' };
  if (node.type === 'MemberExpression') {
    const parts = memberPath(node);
    if (parts && parts[0] === 'token') {
      const id = parts.slice(1).join('.');
      const tok = lk.idToToken.get(id);
      if (tok) {
        return familyMatches(family, tok)
          ? { kind: 'ref', tokenId: id, value: tok.canon ?? tok.value }
          : { kind: 'literal', mismatch: true, value: tok.canon ?? tok.value }; // wrong-type token = violation
      }
    }
    return { kind: 'unknown' };
  }
  if (node.type === 'StringLiteral' || node.type === 'TemplateLiteral') {
    const str = node.type === 'StringLiteral' ? node.value : node.quasis.map((q) => q.value.cooked).join('${}');
    const varMatches = [...str.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]);
    if (varMatches.length) {
      const tok = lk.cssVarToToken.get(varMatches[0]);
      if (tok && familyMatches(family, tok)) return { kind: 'ref', tokenId: tok.id, value: tok.canon ?? tok.value };
      if (tok) return { kind: 'literal', mismatch: true, value: tok.canon };
      return { kind: 'unknown' };
    }
    const low = str.trim().toLowerCase();
    if (EXCLUDED.has(low)) return { kind: 'excluded' };
    return { kind: 'literal', value: low };
  }
  if (node.type === 'NumericLiteral') {
    if (node.value === 0) return { kind: 'excluded' };
    return { kind: 'literal', value: String(node.value) };
  }
  return { kind: 'unknown' };
}

export function parseWeb(code, lk) {
  const decls = []; // {prop, family, kind, tokenId, value}
  const reused = []; // component names
  const missed = []; // {role}
  const componentsUsed = new Set();
  const tokensUsed = new Set();
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  } catch (e) {
    return { error: String(e.message), decls, reused, missed, componentsUsed, tokensUsed };
  }
  const importedDS = new Set();
  traverse(ast, {
    ImportDeclaration(p) {
      const src = p.node.source.value;
      const isDS = src === '@/ds' || src.includes('/ds') || src.endsWith('/ds') || src.includes('design-system') || src.includes('reference/web');
      if (!isDS) return;
      for (const s of p.node.specifiers) {
        if (s.imported && lk.webComponents.has(s.imported.name)) importedDS.add(s.local.name);
        else if (s.local && lk.webComponents.has(s.local.name)) importedDS.add(s.local.name);
      }
    },
  });
  traverse(ast, {
    JSXOpeningElement(p) {
      const nameNode = p.node.name;
      let tag = nameNode.type === 'JSXIdentifier' ? nameNode.name : null;
      if (!tag) return;
      const isHostElement = /^[a-z]/.test(tag);
      const isDSComp = importedDS.has(tag) || lk.webComponents.has(tag);
      // gather this element's inline style props for clone detection
      const stylePropsHere = {};
      for (const attr of p.node.attributes) {
        if (attr.type !== 'JSXAttribute') continue;
        if (attr.name.name !== 'style') continue;
        let obj = attr.value;
        if (obj && obj.type === 'JSXExpressionContainer') obj = obj.expression;
        if (!obj || obj.type !== 'ObjectExpression') continue;
        for (const prop of obj.properties) {
          if (prop.type !== 'ObjectProperty') continue;
          const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
          stylePropsHere[key] = prop.value;
          const family = FAMILY_OF_PROP[key] || (key === 'border' ? 'borderShorthand' : null);
          if (!family) continue;
          const c = classifyValueNode(prop.value, family, lk);
          if (c.kind === 'excluded' || c.kind === 'unknown') continue;
          decls.push({ prop: key, family, kind: c.kind, tokenId: c.tokenId, value: c.value, mismatch: c.mismatch });
          if (c.kind === 'ref') tokensUsed.add(c.tokenId);
        }
      }
      // component reuse accounting
      if (isDSComp) {
        reused.push(tag); componentsUsed.add(tag);
      } else if (isHostElement) {
        const role = inferClonedRole(tag, stylePropsHere, lk);
        if (role) missed.push({ role, tag });
      }
    },
  });

  // standalone CSS in the same code blob (CSS modules / <style>) — best-effort
  return { decls, reused, missed, componentsUsed, tokensUsed };
}

// Heuristics: does a raw host element re-invent a registered component?
function inferClonedRole(tag, styleProps, lk) {
  const has = (k) => k in styleProps;
  const radiusVal = styleProps.borderRadius;
  const isPill = radiusVal && /9{2,}|50%/.test(radiusValToString(radiusVal));
  if (tag === 'button') return 'Button';
  if (tag === 'input' || tag === 'textarea') return 'TextField';
  if (tag === 'select') return null;
  // Badge: pill radius + background, small
  if (isPill && (has('backgroundColor') || has('background'))) return 'Badge';
  // Card: container with surface styling
  if (['div', 'section', 'article', 'aside'].includes(tag)) {
    const cardish = (has('backgroundColor') || has('background')) && has('borderRadius') && (has('boxShadow') || has('border') || has('padding'));
    if (cardish) return 'Card';
    // Stack: flex/grid with a gap literal
    const disp = styleProps.display && literalString(styleProps.display);
    if ((disp === 'flex' || disp === 'grid') && (has('gap') || has('rowGap') || has('columnGap'))) {
      // only a "missed Stack" if the gap is a literal (drift); a tokenized gap is fine on a div
      const gv = styleProps.gap || styleProps.rowGap || styleProps.columnGap;
      if (gv && gv.type !== 'MemberExpression' && !(gv.type === 'StringLiteral' && /var\(/.test(gv.value))) return 'Stack';
    }
  }
  // typography literal on a text host
  if (['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'div', 'a', 'strong'].includes(tag)) {
    if (has('fontSize') || has('fontWeight')) return 'Text';
  }
  return null;
}
function radiusValToString(node) {
  if (!node) return '';
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'NumericLiteral') return String(node.value);
  return '';
}
function literalString(node) {
  if (node && node.type === 'StringLiteral') return node.value;
  return null;
}
