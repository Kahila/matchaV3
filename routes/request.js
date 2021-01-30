//requesting a connection to another client
var express = require('express');
var router = express.Router();
const body_parser = require('body-parser');
var database = require("../database/connect");
var methods = require("./functions/functions");

router.use(body_parser.urlencoded({ extended: true }));
router.get('/request', function(req, res, next) {
    console.log(req.session.user)
    console.log("-------------" + req.query.id);
    //insert the user into matches table and send email
    var insertQuery = "INSERT INTO matcha.usersMatchesTable (userID_one, userID_two, matched) VALUES (\"" + req.session.user.id + "\", \"" + req.query.id + "\", 1)";
    database.conn().query(insertQuery, function(err, result) {
        if (err) throw err;
        //send email and add notification
        var notificationQuery = "INSERT INTO matcha.usersNotificationTable (userID, senderID, notificationType) VALUES (\"" + req.query.id + "\", \"" + req.session.user.id + "\", 'connection request from \"" + req.session.user.uname + "\"')"
        database.conn().query(notificationQuery, function(err, result) {
            if (err) throw err;
            //send email
            var selectQuery = "SELECT userEmail FROM matcha.usersTable WHERE userID=?"
            database.conn().query(selectQuery, req.query.id, function(err, result) {
                if (err) throw err;
                methods.sendEmail(result[0].userEmail, result[0].userName, 'Someone Likes You\nnew notification someone loves your profile');
                res.redirect('back');
            })
        })
    })
});

module.exports = router;