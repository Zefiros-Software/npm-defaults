module.exports = (w) => {
    return {
        files: [
            'package.json',
            'src/**/*.ts',
            'src/**/*.js',
            'src/**/*.json',
            'test/**/*.ts',
            '!test/**/*.spec.ts',
            '!src/vendor.d.ts',
        ],
        tests: ['test/**/*.spec.ts'],

        env: { type: 'node' },

        testFramework: {
            type: 'jest',
        },

        compilers: {
            '**/*.ts': w.compilers.typeScript({
                isolatedModules: true,
                module: 'commonjs',
            }),
        },
    }
}
