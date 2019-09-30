module.exports = {
    branches: [{ name: 'master' }, { name: 'development', channel: 'next', prerelease: 'beta' }],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
                releaseRules: [{ type: 'chore', release: 'patch' }],
            },
        ],
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/github',
        '@semantic-release/npm',
        ["@semantic-release/git", {
            "assets": ["dist/**/*.{js,css}", "docs", "package.json"],
            "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
          }]
    ],
}
