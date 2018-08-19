const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: {
    main: './src/index.js',
    test: "./test/test.js",
    test_set_up: "./test/setup.js",
    parse: './src/cleanerFunctions.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.js$/,
      include: [
        path.resolve(__dirname, '/src'),
        path.resolve(__dirname, '/test')
      ],
      exclude: [path.resolve(__dirname, '/node_modules')],
      loader: 'babel-loader'
    },
    {

    }]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'test')
    ],
    extensions: ['.js', '.json', '.css']
  },
  node: {
    fs: "empty",
    net: 'empty',
  },
  watch: true,
  mode: 'development',
  plugins: [HTMLWebpackPluginConfig]
};
