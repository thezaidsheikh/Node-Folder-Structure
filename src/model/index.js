`use strict`;

const {Sequelize} = require('sequelize');
const config = require('../config');
const fs = require('fs');
const path = require('path');

let db = {};
// let config = config;
let databaseCredentials = {
    name:config.database.name || undefined,
    username:config.database.username || undefined,
    password: config.database.password || undefined,
    host: config.database.host || undefined
};
let sql = new Sequelize(
    databaseCredentials.name,
    databaseCredentials.username,
    databaseCredentials.password,
    {
        dialect: "mysql",
        host: databaseCredentials.host,
        logging: false,
        pool: {
            max: 30,
            min: 0,
            acquire: 60000,
            idle: 5000
        } 
    });
    let checkDB = ()=> {
        try {
            sql.authenticate();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
    checkDB ();
    let registerSchemaInDB = () => {
        fs.readdirSync(__dirname)
            .filter((file) => {
                return (file.indexOf(".") !== 0) && (file !== "index.ts") && (file !== "index.js");
            })
            .forEach((file) => {
                let model = require(path.join(__dirname, file))(sql, Sequelize.DataTypes)
                db[model.name] = model;
            });

        Object.keys(db).forEach((modelName) => {
            if ("associate" in db[modelName]) {
                db[modelName].associate(db);
            }
        });
        db.sequelize = sql
    }
    registerSchemaInDB();
    module.exports = db;