/* eslint-disable */
/** @type {import('next').NextConfig} */
const withAntdLess = require("next-plugin-antd-less");
const path = require("path");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

console.log(path.resolve("./src/assets/styles/antd-theme.less"));

module.exports = withPWA(
  withAntdLess({
    lessVarsFilePath: "./src/assets/styles/antd-theme.less",
    lessVarsFilePathAppendToEndOfContent: true,

    // Other Config Here...
    javascriptEnabled: true,
    images: {
      domains: ["i.ytimg.com"],
    },
    pwa: {
      dest: "public",
      runtimeCaching,
    },
    webpack(config) {
      return config;
    },
  })
);
