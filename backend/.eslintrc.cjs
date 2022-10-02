module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:mocha/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Our use of export is not the one  this rule is meant to disallow
    // doc: https://github.com/lo1tuma/eslint-plugin-mocha/blob/96f4136af432d21a2bf4398eaaf26c4446249391/docs/rules/no-exports.md#disallow-exports-from-test-files-no-exports
    'mocha/no-exports': 'off',
    // Although this is useful, it conflicts with airbnb so we make it the exception rather than the rule
    // doc: https://mochajs.org/#arrow-functions
    'mocha/no-mocha-arrows': 'off',
  },
}
