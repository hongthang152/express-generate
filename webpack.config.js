const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
  entry: "./src/main.js",
  target: "node",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ],
  externals: [nodeExternals()]
};
