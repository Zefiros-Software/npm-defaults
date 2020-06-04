module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'max-classes-per-file': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unused-vars-experimental': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
            },
        ],
        'import/default': 'off',
        'import/order': [
            'error',
            {
                groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin'],
                'newlines-between': 'always',
                pathGroups: [
                    {
                        pattern: '~/**',
                        group: 'internal',
                    },
                ],
            },
        ],
    },
    settings: {
        'import/resolver': {
            typescript: {
                directory: './',
            },
        },
        'import/external-module-folders': ['node_modules', 'typings'],
    },
}
