const path = require('path')

module.exports = function (dir) {
    return (w) => ({
        files: ['src/**/*.ts', 'src/**/*.json', 'tsconfig.json', 'package.json'],
        tests: ['test/**/*.spec.ts'],

        env: { type: 'node' },

        testFramework: 'ava',

        compilers: {
            '**/*.ts': w.compilers.typeScript({
                isolatedModules: true,
                module: 'commonjs',
            }),
        },

        setup: function (w) {
            if (global._tsPathsRegistered) {
                return
            }
            const project = require(path.join(dir, 'tsconfig.json'))
            const tsPaths = require('tsconfig-paths')
            tsPaths.register({
                baseUrl: project.compilerOptions.baseUrl,
                paths: project.compilerOptions.paths,
            })
            global._tsPathsRegistered = true
        },
        debug: true,
    })
}
