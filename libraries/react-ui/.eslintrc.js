module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: ['standard-with-typescript', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'tsdoc/syntax': 'error',
    'no-case-declarations': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'comma-dangle': ['error', 'always-multiline'],
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
