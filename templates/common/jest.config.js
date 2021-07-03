module.exports = {
    roots: ['<rootDir>/src/', '<rootDir>/test/'],
    moduleNameMapper: {
        '~/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.{ts,tsx}', '!**/node_modules/**'],
    testRegex: '.spec.ts$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    coverageProvider: 'v8',
    collectCoverage: false,
    coverageDirectory: '<rootDir>/coverage/',
    coverageReporters: ['lcov', 'text-summary'],
}
