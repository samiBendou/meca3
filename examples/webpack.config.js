// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";
const makeConfig = (env) => ({
  entry: path.resolve(__dirname, env.entry),
  output: {
    filename: `${env.directory}.js`,
    path: path.resolve(__dirname, "out"),
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
      template: "template.html",
      filename: `${env.directory}.html`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "css", to: "build/" },
        { from: "static", to: "build/static" },
      ],
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
});

module.exports = (env) => {
  const config = makeConfig(env);
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
