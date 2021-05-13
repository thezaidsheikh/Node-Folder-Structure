"use strict";

const app = require("./app");
const config = require("./config");
const model = require("./model");
const seed = require("./seed");
const dotenv = require("dotenv");
dotenv.config();

let server = require("http").createServer(app);

const port = config.PORT;
const db = model;
// const socket = new Socket()

// socket.connect(server)

db.sequelize
  .sync()
  .then((res) => {
    console.log("Connected to sequalise server");
    server.listen(port, (err) => {
      if (err) {
        return console.log(err);
      }
      return console.log(`server is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
