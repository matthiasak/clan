let config =
	require("@terse/webpack")
	.api()
	.entry({
		index: "./src/index.js"
	})
	.loader(
		'babel-loader'
		, '.js'
		, {
			exclude: /node_modules/
			, query: { cacheDirectory: true, presets: ['stage-0'] }
		})
	.plugin("webpack.NamedModulesPlugin")
	.plugin("optimize-js-plugin")
	.plugin("webpack.NoErrorsPlugin")
	.externals(/^@?\w[a-z\-0-9\./]+$/)
	.output({
		path: './build'
		, library: 'clan'
		, libraryTarget: 'commonjs2'
	})
	.target("node")
	.sourcemap("source-map")
	.when("production", api => api
		.plugin("webpack.LoaderOptionsPlugin", {
			minimize: true,
			debug: false
		})
		.plugin("webpack.optimize.UglifyJsPlugin", {
			compress: {
				warnings: true
			}
		}))
	.when("development", api => api
		.entry({
			index: "./src/index.js"
		})
		.plugin("webpack.LoaderOptionsPlugin", {
			minimize: false,
			debug: true
		}))
	.getConfig()

delete config.module.preLoaders

module.exports = config