/* eslint-disable */
/** @type {import('next').NextConfig} */
const withAntdLess = require("next-plugin-antd-less");
const path = require("path");

console.log(path.resolve("./src/assets/styles/antd-theme.less"));

module.exports = withAntdLess({
  lessVarsFilePath: "./src/assets/styles/antd-theme.less",
  lessVarsFilePathAppendToEndOfContent: true,

  // Other Config Here...
  javascriptEnabled: true,
  images: {
    domains: ["i.ytimg.com"],
  },
  webpack(config) {
    return config;
  },
});
