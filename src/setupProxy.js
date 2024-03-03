const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    `/api/auth`,
    createProxyMiddleware({
      // TODO add prod host
      target: "https://localhost:443",
      changeOrigin: true,
      secure: false,
    }),
  );
};
