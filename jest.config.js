/**
 * @type {jest.ProjectConfig}
 */
module.exports = {
    roots: ['<rootDir>/src/', '<rootDir>/test/'],
    moduleNameMapper: {
        '~/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.{ts,tsx}', '!**/node_modules/**'],
    testRegex: '.spec.ts$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true,
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage/',
    globals: {
        'ts-jest': { isolatedModules: true, diagnostics: false },
    },
}
