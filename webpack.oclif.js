const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const glob = require('glob')
const nodeExternals = require('webpack-node-externals')

module.exports = function ({ root }) {
    return {
        mode: 'production',
        entry: glob.sync('./src/**/*.ts').reduce((acc, file) => {
            acc[file.replace(/^\.\/src\//, '').replace(/\.ts$/, '')] = file
            return acc
        }, {}),
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.json', '.ts'],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: 'tsconfig.dist.json',
                }),
            ],
        },
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(root, 'dist'),
            filename: '[name].js',
        },
        target: 'node',
        node: false,
        externals: [
            '@oclif/config',
            '@oclif/command',
            'fs-extra-debug',
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
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules|test/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dist.json',
                    },
                },
            ],
        },
    }
}
