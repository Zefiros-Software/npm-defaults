const path = require('path')

module.exports = function(dir) {
    return w => ({
        files: [
            'tsconfig.json',
            { pattern: 'jest.config.js', instrument: false },
            { pattern: 'wallaby.js', instrument: false },
            'src/**/*.ts',
            'src/**/*.js',
            'src/**/*.json',
        ],
        filesWithNoCoverageCalculated: ['jest.config.js', 'wallaby.js'],

        tests: ['test/**/*.spec.ts', 'packages/*/test/**/*.spec.ts'],

        env: { type: 'node' },

        testFramework: {
            type: 'jest',
            path: path.resolve(dir, 'node_modules/jest-cli'),
        },

        compilers: {
            '**/*.ts': w.compilers.typeScript({
                isolatedModules: true,
                module: 'commonjs',
            }),
        },

        setup: function(wallaby) {
            const jestConfig = require('./jest.config.js')
            wallaby.testFramework.configure(jestConfig)
        },
    })
}
