module.exports = {
    ...require('@zefiros/npm-defaults/.eslintrc.base.js'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.lint.json',
    },
}
