module.exports = {
    '**/*.ts': ['yarn fix'],
    '**/*.{js,json}': ['yarn prettier --write --config prettier.config.js'],
}
