const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: path.resolve(__dirname, './react/src/app.jsx'),
  output: {
    path: path.resolve(__dirname, './react/dist'),
    filename: 'bundle-render.js',
    libraryTarget: 'commonjs-module'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
};

