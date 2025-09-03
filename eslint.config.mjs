import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, ...compat.config({
  extends: ['next', 'next/core-web-vitals', 'next/typescript', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
})]

export default eslintConfig
