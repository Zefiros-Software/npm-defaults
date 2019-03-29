/**
 * @type {import('@types/prettier').Options}
 */
module.exports = {
    tabWidth: 4,
    printWidth: 100,
    semi: false,
    trailingComma: 'es5',
    bracketSpacing: true,
    parser: 'typescript',
    singleQuote: true,
    proseWrap: 'never',
    overrides: [
        {
            files: '**/*.json',
            options: {
                parser: 'json',
                tabWidth: 2,
            },
        },
    ],
}
