module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-tsdoc',
    'jest',
  ],
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended',

  ],
  rules: {
    'tsdoc/syntax': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    'no-case-declarations': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
