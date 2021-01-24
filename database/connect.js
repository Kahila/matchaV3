//file containing method concerning the database
var mysql = require('mysql');

//connecting to server
function conn(){
    return (mysql.createConnection({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    }))
}

module.exports = {conn};