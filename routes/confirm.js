var express = require('express');
const router = express.Router();
var database = require("../database/connect");

router.get('/', function(req, res, next) {
    var select = "SELECT userID FROM matcha.usersVerificationTable WHERE verificationCode=?";
    database.conn().query(select, req.query.id, function(err, result){
        if (err) throw err;
        if (result.length == 0){
            req.query.id = null;
        }else{
            //confirming the user and adding the changes to database
            accountConf = "UPDATE matcha.usersVerificationTable SET accountVerified=0 WHERE userID=?";
            database.conn().query(accountConf, result[0].userID, function(err, result){
                if (err) throw err;
            })
        } 
    })
    res.redirect('/login');
    // console.log('No value for FOO yet:', process.env.EMAIL);
});

module.exports = router;
