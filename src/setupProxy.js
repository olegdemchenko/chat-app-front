const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    process.env.REACT_APP_HTTP_HOST,
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    }),
  );
};
