var express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
var email = null;
require('dotenv').config();

var database = require("../database/connect");
var email = "";
var error = 1;
var content = [];

router.post('/login', function(req, res, next) {
    email = req.body.email.toLowerCase();
    var select = "SELECT * FROM matcha.usersTable WHERE userEmail=?";
    database.conn().query(select, email, function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            content = result; //storing user data to add to session
            bcrypt.compare(req.body.p, result[0].userPassword, function(err, result) {
                if (err) throw err;
                if (result) {
                    //checking if user is verified
                    var select = "SELECT * FROM matcha.usersVerificationTable WHERE userID=?";
                    database.conn().query(select, content[0].userID, function(err, result) {
                        if (err) throw err;
                        // console.log(result[0]);
                        if (result[0].accountVerified != 0) {
                            error = -2; // account not verified
                            res.redirect("back");
                        } else {
                            //setting up session
                            var user = {
                                id: 0,
                                email: null,
                                logged_in: true,
                                uname: null,
                                lname: null,
                                fname: null,
                                filled: null,
                                wall: null,
                            };

                            req.session.user = user; //creating the user session
                            req.session.user.email = content[0].userEmail;
                            req.session.user.fname = content[0].userFirstName;
                            req.session.user.lname = content[0].userLastName;
                            req.session.user.uname = content[0].userName;
                            req.session.user.id = content[0].userID;
                            req.session.user.filled = result[0].verificationCode;
                            console.log(content);
                        }

                        //checking if the users information is set
                        console.log(result);
                        if (result[0].verificationCode == "0") {
                            res.redirect("/home");
                        } else {
                            res.redirect("/settings");
                        }
                    });
                } else {
                    error = -1;
                    console.log(result);
                    res.redirect("/login");
                }
            })
        } else {
            error = -1;
            res.redirect("/login");
        }
    })
});

router.get('/', function(req, res, next) {
    res.render('login', { Email: email, error: error });
    error = 1;
});

module.exports = router;