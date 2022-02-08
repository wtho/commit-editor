module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: { impliedStrict: true },
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    vueFeatures: {
      filter: false,
      interpolationAsNonHTML: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript',
    'eslint-config-prettier',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-v-for-template-key': 'off',
    // 'vue/max-attributes-per-line': 'off',
    // 'vue/no-multiple-template-root': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}
