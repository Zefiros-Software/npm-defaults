module.exports = {
    branches: [{ name: 'master' }, { name: 'development', channel: 'next', prerelease: 'beta' }],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/git',
        '@semantic-release/github',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/release-notes-generator',
    ],
}
