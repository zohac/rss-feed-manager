// eslint.config.js

const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['node_modules/**', 'dist/**'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            prettier: prettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'no-console': 'warn',
            'no-debugger': 'error',
            'consistent-return': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
        settings: {
            'import/resolver': {
                typescript: {},
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: "warn", // ou "error" selon votre préférence
        },
    },
];
