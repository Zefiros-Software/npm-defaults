module.exports = {
    hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-commit': 'yarn lint-staged',
        'pre-push': 'yarn test --collectCoverage=false',
    },
}
