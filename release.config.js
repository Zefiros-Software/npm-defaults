module.exports = {
    branches: [{ name: 'master' }, { name: 'development', channel: 'next', prerelease: 'beta' }],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/github',
        '@semantic-release/npm',
        '@semantic-release/git',
    ],
}
