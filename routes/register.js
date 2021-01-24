var express = require('express');
const bcrypt = require('bcrypt');
const body_parser = require('body-parser');
const router = express.Router();
const cryptoRandomString = require('crypto-random-string');
require('dotenv').config();

var database = require("../database/connect");
var methods = require("./functions/functions");
var error = 1;
var inputs = ["", "", "", ""];

router.use(body_parser.urlencoded({extended: true}));
router.post('/register', function(req, res, next){
    inputs[0] = req.body.uname.toLowerCase();
    inputs[1] = req.body.fname.toLowerCase();
    inputs[2] = req.body.lname.toLowerCase();
    inputs[3] = req.body.email.toLowerCase();
    //checking if the user passwords match
    if(req.body.p1 != req.body.p2 || (req.body.p1.length) < 6){
        error = -2;
        res.redirect("back");
    }else{
        //checking if the user exists
        var emailQuery = "SELECT * FROM matcha.usersTable WHERE userEmail=?";
        database.conn().query(emailQuery, req.body.email ,function(err, result){
            if (err) throw err;
            if (result.length > 0){
                //user already exists
                error = -1;
                res.redirect("back");
            }else{
                //registering the new user
                var code = cryptoRandomString({length: 6, type: 'distinguishable'});
                var pass = bcrypt.hashSync(req.body.p1, 10);
                //adding the new user to database
                var insertQuery = "INSERT INTO matcha.usersTable (userName, userFirstName, userLastName, userEmail, userFame, userPassword, userTracker, userBio) VALUES (\"" + inputs[0] + "\", \"" + inputs[1] + "\", \"" + inputs[2] + "\", \""+ inputs[3] +"\", \"" + 0 + "\", \"" + pass + "\", \"" + 0 + "\", \"" + null + "\")";
                database.conn().query(insertQuery, function(err, result){
                    if(err) throw err;
                    //sending email to user with verification code
                    methods.sendEmail(inputs[3], inputs[0], 'Thank You For Registering To MATCHA\nclick to verify http://localhost:3000/confirm?id=' + code);
                    //adding user to verification table
                    var getUser = "SELECT userID FROM matcha.usersTable WHERE userEmail=?"
                    database.conn().query(getUser, inputs[3], function(err, result){
                        if (err) throw err;
                        console.log(result[0].userID);
                        var getID = "INSERT INTO matcha.usersVerificationTable (userID, accountVerified, verificationCode) VALUES (\""+ result[0].userID +"\", \""+ 1 +"\", \""+ code +"\")";
                        database.conn().query(getID, function(err, result){
                            if (err) throw err;
                            error = 0;
                            res.redirect("back");
                        })
                    })
                })
            }
        })
    }
})

router.get('/', function(req, res, next) {
    res.render('register', {error: error, userName: inputs[0] , lastName: inputs[1], firstName: inputs[2], email: inputs[3]});
    error = 1;
});

module.exports = router;
