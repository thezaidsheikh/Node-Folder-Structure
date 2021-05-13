'use strict';

module.exports = {
    database: {
        name     : 'isKillDB',
        host     : 'localhost',
        username : 'root',
        password : "zaidroot",
        port     : "3306"
    },
    PORT:2021,
    BASE_URL:`http://localhost:${this.PORT}/api/`,
    tokenValidity:7200
}