const path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/js"),
    filename: "[name].js",
  },
  resolve: {
    preferRelative: true,
    modules: [path.resolve(__dirname, "./src/components"), "node_modules"],
    alias: {
      accounts: path.resolve(__dirname, "./src/components/Accounts"),
      utils: path.resolve(__dirname, "./src/components/Utils"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /.(jpg|jpeg|png|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
};
