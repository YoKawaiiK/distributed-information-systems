const { defineConfig } = require("@vue/cli-service");

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: "@import '~@/assets/style/main.scss';",
      },
    },
  },
});
