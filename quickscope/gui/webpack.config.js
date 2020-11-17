"use strict";

const CopyPlugin = require('copy-webpack-plugin');

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var htmlPlugin = new _htmlWebpackPlugin.default({
    template: "./src/index.html"
});

var config = {
    mode: "development",
    entry: "./src/index.js",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: [
                    'file-loader'
                ]
            }]
    },
    plugins: [new CopyPlugin([
                  { from: 'src/public', to: 'public' },
                ]),
              htmlPlugin]
};

exports.default = config;