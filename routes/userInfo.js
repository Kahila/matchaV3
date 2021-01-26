var express = require('express');
var router = express.Router();
var database = require("../database/connect");

router.get('/', function(req, res, next) {
    //user must have sasion
    var tmp = [];
    var matches = [];
    var users = [];
    var images = [];
    var fame = [];
    var age = [];

    var userQuery = "SELECT * FROM matcha.usersMatchesTable";
    database.conn().query(userQuery, function(err, result) {
        if (err) throw err;
        var userInfo = "SELECT * FROM matcha.usersTable"
        database.conn().query(userInfo, function(err, result2) {
            if (err) throw err;
            imgs = "SELECT * FROM matcha.usersPicturesTable";
            database.conn().query(imgs, req.session.user.id, function(err, result3) {
                    if (err) throw err;
                    for (var item in result) {
                        if (result[item].userID_one == req.session.user.id) {
                            for (var info in result2) {
                                if (result2[info].userID == result[item].userID_two) {
                                    users.push(result2[info].userName);
                                    age.push(result2[info].userAge);
                                    fame.push(result2[info].userFame)
                                    for (var info in result3) {
                                        if (result3[info].userID == result[item].userID_two) {
                                            images.push(result3[info].wallpaper);
                                        }
                                    }
                                    console.log("------" + result[item].userID_one);
                                }
                            }
                        }
                        if (result[item].userID_two == req.session.user.id) {
                            for (var info in result2) {
                                if (result2[info].userID == result[item].userID_one) {
                                    users.push(result2[info].userName);
                                    age.push(result2[info].userAge);
                                    fame.push(result2[info].userFame)
                                    for (var info in result3) {
                                        if (result3[info].userID == result[item].userID_one) {
                                            images.push(result3[info].wallpaper);
                                        }
                                    }
                                    console.log("------" + result[item].userID_one);
                                }
                            }
                        }
                    }
                    res.render('userInfo', { users: users, age: age, img: images, fame: fame });
                }, ) ////////
        })
    })
});

module.exports = router;