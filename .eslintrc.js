module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    // v.1.6 (2022-03-14)
    '@typescript-eslint/no-explicit-any': 0,
    'arrow-parens': [1, 'as-needed'],
    'brace-style': [1, 'stroustrup', { allowSingleLine: true }],
    'class-methods-use-this': 0,
    'func-names': [1, 'always', { generators: 'never' }],
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-console': [1, { allow: ['error', 'info', 'warning'] }],
    'no-param-reassign': [1, { props: false }],
    'no-plusplus': [1, { allowForLoopAfterthoughts: true }],
    'no-return-assign': 0,
    'linebreak-style': 0,
    'object-curly-newline': [
      0,
      {
        ObjectExpression: 'always',
        ObjectPattern: { minProperties: 2 },
      },
    ],
    radix: [1, 'as-needed'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
