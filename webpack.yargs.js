const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = function ({ root }) {
    return {
        mode: 'production',
        target: 'node',
        node: false,
        entry: './src/index.ts',
        devtool: 'source-map',
        resolve: {
            mainFields: ['main'],
            extensions: ['.js', '.json', '.ts'],
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
                    test: /\.(ts|js)$/,
                    exclude: /node_modules|test/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dist.json',
                        compiler: 'ttypescript',
                    },
                },
            ],
        },
    }
}
