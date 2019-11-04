module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.lint.json',
    },
    plugins: ['@typescript-eslint', 'extra-rules', 'unicorn', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
    rules: {
        'max-classes-per-file': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/no-relative-parent-imports': 'error',
        'import/no-extraneous-dependencies': [
            'off',
            {
                devDependencies: false,
            },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
            },
        ],
        'unicorn/filename-case': [
            'error',
            {
                case: 'kebabCase',
            },
        ],
        'extra-rules/no-commented-out-code': 'warn',
    },
}
