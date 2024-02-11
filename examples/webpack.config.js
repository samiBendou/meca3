// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { env } = require("process");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: env.entry,
  output: {
    path: path.resolve(__dirname, "build"),
  },
  devServer: {
    open: true,
    host: "localhost",
    static: {
      directory: path.resolve(__dirname, "./static"),
      publicPath: "/static",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "css" }],
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = (env) => {
  config.entry = path.resolve(__dirname, env.entry);
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
