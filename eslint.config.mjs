import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'dist/**', '*.d.ts']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'prefer-const': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
);
