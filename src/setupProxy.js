const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/database", "/image_list", "/upload", "/comparison", "/results"], { target: "http://localhost:8000" })
  );
};