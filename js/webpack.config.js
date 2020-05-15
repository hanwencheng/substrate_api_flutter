const webpack = require("webpack");
const path = require("path");

const config = {
  entry: "./dist/main.js",
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "main.js"
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
