const nodeExternals = require('webpack-node-externals')
const tsTransformPaths = require('@zerollup/ts-transform-paths')

const path = require('path')

module.exports = function ({ root }) {
    return {
        mode: 'production',
        target: 'node',
        node: false,
        entry: './src/index.ts',
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.json', '.ts', '.d.ts'],
        },
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(root, 'dist'),
            filename: '[name].js',
        },
        stats: {
            // Ignore warnings due to yarg's dynamic module loading
            warningsFilter: [/node_modules\/yargs/, /node_modules\/require-main-filename/],
        },
        externals: [
            nodeExternals({
                modulesFromFile: {
                    exclude: ['devDependencies'],
                    include: ['dependencies'],
                },
            }),
        ],
        optimization: {
            minimize: false,
        },
        module: {
            rules: [
                {
                    test: /(?<!\.d)\.(t|j)sx?$/,
                    exclude: /node_modules|test/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dist.json',
                        projectReferences: true,
                        getCustomTransformers: (program) => {
                            const transformer = tsTransformPaths(program)
                            return {
                                before: [transformer.before],
                                afterDeclarations: [transformer.afterDeclarations],
                            }
                        },
                    },
                },
                {
                    test: /\.d\.ts$/,
                    loader: 'ignore-loader',
                },
            ],
        },
    }
}
