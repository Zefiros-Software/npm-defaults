export default {
    files: ['test/**/*'],
    extensions: ['ts'],
    nodeArguments: ['-r', 'ts-node/register/transpile-only', '-r', 'tsconfig-paths/register'],
}
