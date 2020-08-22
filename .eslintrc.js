module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {},
  overrides: [
    {
      files: ['client/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['react', '@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      env: {
        browser: true,
        es2020: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
    {
      files: ['server/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      rules: {},
    },
  ],
};
