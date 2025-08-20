import eslintComments from 'eslint-plugin-eslint-comments';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [  {
  ignores: ["src/features/Editor/**"], // ⛔ Exclude borrowed code
},
  ...compat.extends('next/core-web-vitals'),
  {
    
    plugins: {
      'eslint-comments': eslintComments,
    },
    
    rules: {
      // ✅ Ignore borrowed code's unnecessary disables
      'eslint-comments/no-unused-disable': 'off',
      '@next/next/no-img-element': 'off',

      // Optional: turn off these rules globally if not needed
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
