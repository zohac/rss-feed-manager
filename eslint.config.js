// eslint.config.js

const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const jestPlugin = require('eslint-plugin-jest');

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
            jest: jestPlugin,
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
        overrides: [
            {
                files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts', 'jest.setup.ts'],
                env: {
                    jest: true, // Définir l'environnement Jest uniquement pour les fichiers de test
                },
                rules: {
                    // Vous pouvez ajouter ou ajuster des règles spécifiques pour les tests ici
                },
            },
        ],
    },
];
