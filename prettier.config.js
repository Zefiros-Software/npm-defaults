module.exports = {
    tabWidth: 4,
    printWidth: 130,
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
