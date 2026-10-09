import eslintConfig from 'eslint-config-next'

const config = [
  {
    ignores: ['.next', 'out', 'node_modules', 'public', '.analyzer'],
  },
  ...eslintConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]

export default config
