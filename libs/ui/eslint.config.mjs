import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'jp',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'jp',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/lib/ui/ui.ts', 'src/lib/ui/ui.ts', 'libs/ui/src/lib/ui/ui.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/link/link.ts'],
    rules: {
      // Keep native anchor semantics and Angular RouterLink on the same element.
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'jp',
          style: 'camelCase',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Test hosts deliberately exercise imperative bindings with Eager detection.
      // Angular 22's migration preserved their pre-upgrade behavior.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
