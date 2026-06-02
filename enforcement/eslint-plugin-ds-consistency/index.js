// ESLint plugin: make raw style literals fail the build, so the consistent path
// is the only path that lints clean. Flat-config compatible.
//
//   import ds from 'eslint-plugin-ds-consistency';
//   export default [{ plugins: { ds }, rules: { 'ds/no-raw-style-literals': 'error' } }];

const COLOR_PROPS = new Set(['color', 'backgroundColor', 'background', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor', 'fill', 'stroke', 'caretColor', 'textDecorationColor']);
const DIM_PROPS = new Set(['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingBlock', 'paddingInline', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'rowGap', 'columnGap', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderWidth', 'fontSize', 'letterSpacing', 'boxShadow']);
const ALLOW = new Set(['0', '0px', 'auto', 'inherit', 'initial', 'unset', 'none', '100%', 'currentColor', 'transparent', 'normal', 'fit-content', 'max-content', 'min-content']);

const isColorLiteral = (s) => /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b(red|blue|green|black|white|gray|grey|orange|pink|purple|yellow)\b/.test(s);
const isDimLiteral = (s) => /-?\d*\.?\d+(px|rem|em|pt|%)?/.test(s) || /\d+px\s+\d/.test(s) || isShadow(s);
const isShadow = (s) => /\d+px\s+\d+px/.test(s);

export const rules = {
  'no-raw-style-literals': {
    meta: {
      type: 'problem',
      docs: { description: 'Disallow raw color/spacing/radius/shadow literals in JSX style objects; reference design tokens instead.' },
      messages: {
        rawColor: "Raw color literal '{{val}}' in `{{prop}}`. Use a token: token.color.* (var(--…)).",
        rawDim: "Raw dimension literal '{{val}}' in `{{prop}}`. Use a token: token.space.* / token.radius.* / a <Text variant> for type.",
      },
      schema: [],
    },
    create(context) {
      const check = (prop, node, raw) => {
        const s = String(raw).trim();
        if (ALLOW.has(s) || s.startsWith('var(') || s === '') return;
        if (COLOR_PROPS.has(prop) && isColorLiteral(s)) context.report({ node, messageId: 'rawColor', data: { val: s, prop } });
        else if (DIM_PROPS.has(prop) && isDimLiteral(s)) context.report({ node, messageId: 'rawDim', data: { val: s, prop } });
      };
      return {
        JSXAttribute(attr) {
          if (attr.name.name !== 'style') return;
          let obj = attr.value;
          if (obj && obj.type === 'JSXExpressionContainer') obj = obj.expression;
          if (!obj || obj.type !== 'ObjectExpression') return;
          for (const p of obj.properties) {
            if (p.type !== 'Property' && p.type !== 'ObjectProperty') continue;
            const prop = p.key.name || p.key.value;
            const v = p.value;
            if (v.type === 'Literal' || v.type === 'StringLiteral') check(prop, v, v.value);
            else if (v.type === 'NumericLiteral') check(prop, v, v.value);
            else if (v.type === 'TemplateLiteral') check(prop, v, v.quasis.map((q) => q.value.cooked).join(''));
          }
        },
      };
    },
  },
};

export default { rules, meta: { name: 'eslint-plugin-ds-consistency', version: '1.0.0' } };
