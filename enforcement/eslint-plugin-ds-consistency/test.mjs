// Verify the no-raw-style-literals rule with ESLint's RuleTester.
import { RuleTester } from 'eslint';
import plugin from './index.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-raw-style-literals', plugin.rules['no-raw-style-literals'], {
  valid: [
    { code: 'const x = <div style={{ background: token.color.action.primary, padding: token.space.md }} />;' },
    { code: 'const x = <div style={{ color: "var(--color-text-primary)", gap: "var(--space-md)" }} />;' },
    { code: 'const x = <div style={{ padding: 0, margin: "auto", width: "100%" }} />;' },
    { code: 'const x = <Button variant="primary" />;' },
  ],
  invalid: [
    { code: 'const x = <div style={{ background: "#ffffff" }} />;', errors: [{ messageId: 'rawColor' }] },
    { code: 'const x = <div style={{ padding: "16px" }} />;', errors: [{ messageId: 'rawDim' }] },
    { code: 'const x = <div style={{ borderRadius: 12 }} />;', errors: [{ messageId: 'rawDim' }] },
    { code: 'const x = <span style={{ color: "rgb(102,102,102)", fontSize: "15px" }} />;', errors: [{ messageId: 'rawColor' }, { messageId: 'rawDim' }] },
    { code: 'const x = <div style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />;', errors: [{ messageId: 'rawDim' }] },
  ],
});

console.log('✅ eslint-plugin-ds-consistency: all RuleTester cases passed');
