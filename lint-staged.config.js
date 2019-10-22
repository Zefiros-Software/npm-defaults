module.exports = {
    '**/*.ts': ['yarn fix', 'git add'],
    '**/*.{js,json}': ['yarn prettier --write --config prettier.config.js', 'git add'],
}
