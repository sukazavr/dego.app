module.exports = {
  extends: ['react-app'],

  // Whisk rules
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: {
        '@typescript-eslint/strict-boolean-expressions': [
          'warn',
          {
            allowNullable: true,
            ignoreRhs: true,
          },
        ],
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/class-name-casing': 'warn',
        '@typescript-eslint/interface-name-prefix': [
          'warn',
          {
            prefixWithI: 'always',
          },
        ],
        'object-shorthand': 'warn',
        'no-shadow': [
          'error',
          {
            allow: ['style'],
          },
        ],
      },
    },
  ],
};
