const model = require("./model");
const constant = require("./constant");
const axios = require("axios");

module.exports = (function () {
  let db = model;

  db["user"]
    .findOne({ where: { email: "admin@gmail.com" } })
    .then((admin) => {
      if (!admin) {
        Promise.all([
          db["user"].create({
            email: "admin@gmail.com",
            password: "admin123",
            scope: constant.SCOPE.ADMIN,
            role: constant.ROLE.ADMIN,
          }),
        ])
          .then(console.log)
          .catch(console.log);
      }
      db["client"]
        .findOne({ where: { clientId: "ISKILLCLIENT" } })
        .then((client) => {
          if (!client) {
            Promise.all([
              db["client"].create({
                clientId: "ISKILLCLIENT",
                clientSecret: "ISKILL123",
              }),
            ]);
          }
        });
    })
    .catch(console.log);
})();
