module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  rules: {
    'tsdoc/syntax': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-case-declarations': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
