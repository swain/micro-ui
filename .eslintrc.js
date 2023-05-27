module.exports = {
  extends: [
    '@lifeomic/standards/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  env: {
    node: true,
    browser: true,
  },
};
