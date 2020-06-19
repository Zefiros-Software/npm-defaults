module.exports = {
    '*.{ts, tsx}': ['yarn eslint --fix --resolve-plugins-relative-to . --ignore-pattern examples'],
    '*/**/*.{js,json}': ['yarn prettier --write --config prettier.config.js'],
}
