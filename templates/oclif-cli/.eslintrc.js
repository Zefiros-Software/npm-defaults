module.exports = {
    ...require('@zefiros/npm-defaults/.eslintrc.js'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.lint.json',
    },
}
