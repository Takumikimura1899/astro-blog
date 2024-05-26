import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'
import astroEslintParser from 'astro-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'

const compat = new FlatCompat()

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends(
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ),
  {
    plugins: {
      typescriptEslint,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['src/**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: typescriptEslintParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
]
