"use strict";

const constant = require("../constant");
const sectorController = require("../controller/sector.controller");

module.exports = (app, router) => {
  // create , get sector management routes
  router
    .route("/sector")
    .post(app.authenticate({ scope: constant.SCOPE.ADMIN }), (req, res) => {
      sectorController.create(req, (status, response) => {
        res.status(status).send(response);
      });
    })
    .get(app.authenticate({ scope: constant.SCOPE.ADMIN }), (req, res) => {
      sectorController.listAll(req, (status, response) => {
        res.status(status).send(response);
      });
    });

  // update , delete sector management routes
  router
    .route("/sector/:sectorId")
    .put(app.authenticate({ scope: constant.SCOPE.ADMIN }), (req, res) => {
      sectorController.update(req, (status, response) => {
        res.status(status).send(response);
      });
    })
    .delete(app.authenticate({ scope: constant.SCOPE.ADMIN }), (req, res) => {
      sectorController.deleteSector(req, (status, response) => {
        res.status(status).send(response);
      });
    });
};
