const webpack = require("webpack")
const path = require('path')
// const Offline = require('offline-plugin')
const OptimizeJsPlugin = require("optimize-js-plugin")

// debug?
const isDebug = process.env.NODE_ENV !== "production"

const browser = {

    // Developer tool to enhance debugging, source maps
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: isDebug ? 'source-map' : false,

    // Options affecting the normal modules
    // https://webpack.github.io/docs/list-of-loaders.html
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: "babel-loader",
            query: { cacheDirectory: true, compact: true },
            test: /\.(jsx|js|es|es6|mjs)$/,
        }]
    },

    // http://webpack.github.io/docs/configuration.html#resolve
    resolve: {
        alias: {
            // components: path.resolve('src/components/'),
        }
    },

    node: {
        __filename: true,
        __dirname: true,
    },

    output: {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        filename: "[name].js",
        chunkFilename: "[id].js",
        sourceMapFilename: "[name].js.map",
        path: './build',
        library: 'clan',
        libraryTarget: 'commonjs'
        // publicPath: '/build',
    },

    entry: {
      "index": "./index.js"
    },

    target: "web",

    plugins: [

        new webpack.LoaderOptionsPlugin({
            minimize: !isDebug,
            debug: isDebug
        }),

        new webpack.NamedModulesPlugin(),

        // new webpack.ProvidePlugin({
        //     React: 'react',
        //     DOM: 'react-dom'
        // }),

        // new webpack.DefinePlugin({
        //     'process.env':{
        //         'NODE_ENV': JSON.stringify(isDebug ? 'production' : 'development')
        //     }
        // }),

        // new Offline({
        //   ServiceWorker: {
        //     events: true,
        //     caches: {
        //       main: ['/', '/**.js'],
        //     }
        //   }
        // }),

    ]
    .concat(isDebug ? [
        // new webpack.HotModuleReplacementPlugin
    ] : [
        new OptimizeJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin,
        new webpack.optimize.AggressiveMergingPlugin,
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: true
            }
        }),
    ])

}

module.exports = {default: browser, isDebug }
