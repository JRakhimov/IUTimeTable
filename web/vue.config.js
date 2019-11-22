module.exports = {
  publicPath: "./",
  assetsDir: "assets",
  productionSourceMap: false,
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
};
