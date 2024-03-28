// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";
const makeConfig = (env) => ({
  entry: path.resolve(__dirname, `./dist/${env.sourcePath}.js`),
  output: {
    filename: `${env.name}.js`,
    path: path.resolve(__dirname, "out"),
  },
  devServer: {
    open: false,
    host: "localhost",
    static: {
      directory: path.resolve(__dirname, "./static"),
      publicPath: "/static",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "template.ejs",
      filename: `${env.name}.html`,
      templateParameters: {
        pageName: env.name,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "css", to: "" },
        { from: "static", to: "static" },
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
  const parsedEnv = env.name.includes("/")
    ? {
        ...env,
        sourcePath: env.name,
        name: env.name.split("/").slice(-2, -1)[0],
      }
    : { ...env, sourcePath: env.name };

  const config = makeConfig(parsedEnv);
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      })
    );
  } else {
    config.mode = "development";
  }

  return config;
};
