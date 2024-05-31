const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    `/api/auth`,
    createProxyMiddleware({
      // TODO add prod host
      target: "http://localhost:4000",
      changeOrigin: true,
      secure: false,
    }),
  );
};
