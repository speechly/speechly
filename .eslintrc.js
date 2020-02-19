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
    'no-case-declarations': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
