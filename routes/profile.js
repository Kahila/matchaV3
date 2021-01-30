var express = require('express');
var router = express.Router();
require('dotenv').config();
var database = require("../database/connect");
const body_parser = require('body-parser');
const bcrypt = require('bcrypt');

var pass = 0;
var newPass = 0;

router.use(body_parser.urlencoded({ extended: true }));
router.post('/profile', function(req, res, next) {
    userInfo = "SELECT * FROM matcha.usersTable WHERE userID=?"
    database.conn().query(userInfo, req.session.user.id, function(err, result) {
        if (err) throw err;
        bcrypt.compare(req.body.pass1, result[0].userPassword, function(err, result) {
            if (err) throw err;
            if (result) {
                if (req.body.username.length > 0) {
                    update = "UPDATE matcha.usersTable SET userName=? WHERE userID=" + req.session.user.id + "";
                    database.conn().query(update, req.body.username, function(err, result) {
                        if (err) throw err;
                    });
                }
                if (req.body.pass2 >= 6 || req.body.pass3 == req.body.pass2) {
                    var code = bcrypt.hashSync(req.body.pass2, 10);
                    update = "UPDATE matcha.usersTable SET userPassword=? WHERE userID=" + req.session.user.id + "";
                    database.conn().query(update, code, function(err, result) {
                        if (err) throw err;
                        res.redirect("back");
                    })
                } else {
                    newPass = 1;
                    res.redirect("back");
                }
            } else {
                pass = 1;
                res.redirect("back");
            }
        })
    })
})

router.get('/', function(req, res, next) {
    if (req.session.user.logged_in == true) {
        userInfo = "SELECT * FROM matcha.usersTable WHERE userID=?"
        database.conn().query(userInfo, req.session.user.id, function(err, result) {
            if (err) throw err;
            userImage = "SELECT wallpaper FROM matcha.usersPicturesTable WHERE userID=?"
            database.conn().query(userImage, req.session.user.id, function(err, result1) {
                if (err) throw err;
                res.render('profile', { image: result1[0].wallpaper, username: result[0].userName, pass: pass, newPass: newPass });
                pass = 0;
                newPass = 0;
            })
        });
    } else {
        res.redirect("/error");
    }
});

module.exports = router;