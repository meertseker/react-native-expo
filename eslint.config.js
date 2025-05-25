/* eslint-env node */
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends('expo', 'prettier'),
  {
    ignores: [
      'backend/**/*',
      'node_modules/**/*',
      '.expo/**/*',
      'dist/**/*',
      'web-build/**/*',
      '**/*.pyc',
      '**/__pycache__/**/*',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
];
