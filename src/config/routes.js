"use strict";

module.exports = (app, router) => {
  require("../routes/user.routes")(app, router);
  require("../routes/oauth.routes")(app, router);
  require("../routes/sector.routes")(app, router);
};
