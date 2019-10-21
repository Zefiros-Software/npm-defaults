module.exports = {
    hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-commit': 'yarn fix',
        'post-commit': 'git update-index --again',
        'pre-push': 'yarn test',
    },
}
