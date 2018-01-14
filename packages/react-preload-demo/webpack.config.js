const path = require('path');
const DefinePlugin = require('webpack').DefinePlugin;
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const root = path.resolve(process.cwd(), '..', '..');
const env = process.env.NODE_ENV || 'development';

// Target the source code of sibling packages.
const alias = [
  'react-preload-core',
  'react-preload-apollo',
  'react-preload-universal-component',
  'react-router-preload',
].reduce((carry, current) => {
  const package = path.join(root, 'packages', current, 'src', 'index');

  return {
    ...carry,
    [current]: package,
  };
}, {});

module.exports = {
  devtool: 'source-map',

  entry: {
    app: path.resolve(process.cwd(), 'src', 'index'),
  },

  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'bundle-[chunkHash].js',
    chunkFilename: '[name]-[chunkHash].js',
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: env === 'development',
    }),
    new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
  ].concat(
    env === 'production'
      ? [
          new UglifyJsPlugin({
            minimize: true,
            compress: false,
            sourceMap: true,
          }),
        ]
      : [],
  ),

  resolve: {
    modules: [path.join(root, 'node_modules')],
    alias: alias,
  },

  resolveLoader: {
    modules: [path.join(root, 'node_modules')],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              extends: path.join(process.cwd(), '.babelrc'),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: (() => {
          const loaders = [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader?modules',
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]-[hash:base64]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ];

          if (env === 'production') {
            return ExtractTextPlugin.extract({
              use: loaders,
              fallback: 'style-loader',
            });
          }

          return loaders;
        })(),
      },
    ],
  },

  devServer: {
    inline: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
  },
};
