module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: ['standard-with-typescript', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'no-case-declarations': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'react/prop-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    'tsdoc/syntax': 'error',
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
