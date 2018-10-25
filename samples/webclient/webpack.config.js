const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      AWS_REGION: JSON.stringify('ap-northeast-1'),
      AWS_COGNITO_IDENTITY_POOL_ID: JSON.stringify(
        process.env.SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_DEV
      ),
      AWS_COGNITO_USER_POOL_ID: JSON.stringify(
        process.env.SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_DEV
      ),
      AWS_COGNITO_USER_POOL_CLIENT_ID: JSON.stringify(
        process.env.SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_DEV
      )
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  }
};
