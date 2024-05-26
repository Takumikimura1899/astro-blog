/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  arrowParens: 'always',
  printWidth: 80,
  bracketSpacing: true,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-organize-imports'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
