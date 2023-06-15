const express = require("express");
const {
  initializeConfigMiddlewares,
  initializeErrorMiddlwares,
} = require("./middlewares");
const userRoutes = require("../controllers/user.routes");
const customersRoutes = require("../controllers/customers.routes");
const projectsRoutes = require("../controllers/projects.routes")
const authRoutes = require("../controllers/auth.routes");

class WebServer {
  app = undefined;
  port = 3001;
  server = undefined;

  constructor() {
    this.app = express();

    initializeConfigMiddlewares(this.app);
    this._initializeRoutes();
    initializeErrorMiddlwares(this.app);
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }

  _initializeRoutes() {
    this.app.use("/users", userRoutes.initializeRoutes());
    this.app.use("/customers", customersRoutes.initializeRoutes());
    this.app.use("/projects", projectsRoutes.initializeRoutes());
    this.app.use(authRoutes.initializeRoutes());
  }
}

module.exports = WebServer;
