// .eslintrc.js
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // important for ESM (import/export)
  },
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
  },
};
