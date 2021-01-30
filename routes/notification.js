var express = require('express');
var router = express.Router();
const body_parser = require('body-parser');
var database = require("../database/connect");
// var methods = require("./functions/functions");
var notification = [];
var wallpaper = [];
var id = [];

router.use(body_parser.urlencoded({ extended: true }));
router.get('/', function(req, res, next) {
    if (req.session.user.logged_in == true) {
        //select the Id's from the notification table
        var selectQuery = "SELECT * FROM matcha.usersNotificationTable WHERE userID=?";
        database.conn().query(selectQuery, req.session.user.id, function(err, result) {
            if (err) throw err;
            var selectImage = "SELECT * FROM matcha.usersPicturesTable";
            database.conn().query(selectImage, function(err, result1) {
                if (err) throw err;
                for (var item in result) {
                    for (var val in result1) {
                        if (result[item].senderID == result1[val].userID) {
                            wallpaper.push(result1[val].wallpaper);
                            notification.push(result[item].notificationType);
                            id.push(result[item].senderID);
                        }
                    }
                }
                console.log(result);
                res.render('notification', { notification: notification, wallpaper: wallpaper, id: id });
                notification = [];
                wallpaper = [];
                id = [];
            })
        })


    } else {
        res.redirect('/error');
    }
});

module.exports = router;