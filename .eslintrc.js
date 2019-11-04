module.exports = {
    ...require('./.eslintrc.base.js'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.lint.json',
    },
}
