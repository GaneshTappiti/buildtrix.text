/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript'
  ],
  rules: {
    // Add any custom rules here
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Common rules you might want to disable:
    // Uncomment any of these to disable specific rules

    // React/JSX rules
    // 'react/no-unescaped-entities': 'off',
    // 'react/display-name': 'off',
    // 'react/jsx-key': 'off',
    // 'react/no-children-prop': 'off',
    // 'react/react-in-jsx-scope': 'off', // Not needed in Next.js 13+

    // Next.js specific rules
    // '@next/next/no-img-element': 'off', // If you want to use <img> instead of Next.js Image
    // '@next/next/no-html-link-for-pages': 'off',
    // '@next/next/no-page-custom-font': 'off',

    // TypeScript rules
    // '@typescript-eslint/ban-ts-comment': 'off',
    // '@typescript-eslint/prefer-as-const': 'off',
    // '@typescript-eslint/no-inferrable-types': 'off',
    // '@typescript-eslint/no-empty-function': 'off',
    // '@typescript-eslint/no-non-null-assertion': 'off',

    // Import rules
    // 'import/no-anonymous-default-export': 'off',

    // General ESLint rules
    // 'no-console': 'off',
    // 'no-debugger': 'off',
    // 'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars instead
    // 'prefer-const': 'off',
    // 'no-var': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
  ],
};
