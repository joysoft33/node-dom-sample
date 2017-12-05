/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const configTranspile = require('./webpack.babel');
const configLinter = require('./webpack.eslint');
const configStyles = require('./webpack.styles');

module.exports = (PRODUCTION, base) => {

  const config = {
    target: 'web',
    entry: {
      index: path.resolve(`public/js/${base}App.js`),
    },
    output: {
      path: path.resolve('dist', base),
      filename: '[name].js'
    },
    module: {
      rules: [
        configLinter,
        configTranspile(PRODUCTION, 'public'),
        configStyles(PRODUCTION),
        {
          test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot|wav|mp3|ico)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 1
            }
          }]
        }, {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              minimize: PRODUCTION
            }
          }]
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(PRODUCTION)
      }),
      new webpack.ProvidePlugin({
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        $: 'jquery'
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(`public/${base}.html`),
        favicon: path.resolve('public/favicon.ico')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({
          resource
        }) => /node_modules/.test(resource)
      })
    ],
    devtool: PRODUCTION ? 'source-map' : 'inline-source-map'
  };

  if (PRODUCTION) {
    config.plugins.push(new MinifyPlugin());
  }

  return config;
};