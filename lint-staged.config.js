module.exports = {
    '**/*.ts': ['yarn fix', 'git add'],
    '**/*.{js,json}': ['yarn prettier --write', 'git add'],
}
