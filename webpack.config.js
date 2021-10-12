const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  mode: "development",
  entry: ["./src/js/main.js", "./src/scss/main.scss"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "assets/[name][ext][query]",
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "src/assets"),
      watch: true,
    },
    watchFiles: ["index.html"],
    open: true,
    hot: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },

      {
        test: /\.svg$/i,
        type: "asset/inline",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "./node_modules/leaflet/dist/leaflet.css", to: "css" },
        { from: "./node_modules/leaflet/dist/images", to: "css/images" },
      ],
    }),
    new MiniCssExtractPlugin(),
    new EnvironmentPlugin(["API_KEY_MAP"]),
  ],
};
