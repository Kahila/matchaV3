var express = require('express');
const bcrypt = require('bcrypt');
const body_parser = require('body-parser');
const mysql = require('mysql');
const router = express.Router();
const cryptoRandomString = require('crypto-random-string');
var methods = require("./functions/functions");
require('dotenv').config();

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "root",
    port: "8889"
});

var emailCheck = 0;
//sending a randomly generated password to the user
router.use(body_parser.urlencoded({ extended: true }));
router.post('/forgot', function(req, res, next) {
    var emailQuery = "SELECT * FROM matcha.usersTable WHERE userEmail=?";
    con.query(emailQuery, req.body.email, function(err, result) {
        if (err) throw err;
        if (result.length == 0) {
            emailCheck = 1; //email does not exists
            res.redirect("back");
        } else {
            var code = cryptoRandomString({ length: 6, type: 'distinguishable' }); //string to be send to the new client for verification
            console.log("code sent to user is" + code);
            var pass = bcrypt.hashSync(code, 10);
            console.log(pass);
            insert = "UPDATE matcha.usersTable SET userPassword='" + pass + "' WHERE userEmail=?";
            con.query(insert, result[0].userEmail, function(err, result) {
                if (err) throw err;
                console.log("password changed");
                emailCheck = 2; //the password has been change successfully
                methods.sendEmail(req.body.email, req.body.uname, 'Account Password Change Success\nnew password is: ' + code + ' and can be changed once loged in again');
                res.redirect("back");
            });

            //sending email to client
        }
    });
})

router.get('/', function(req, res, next) {
    res.render('forgot', { check: emailCheck });
    emailCheck = 0;
});

module.exports = router;