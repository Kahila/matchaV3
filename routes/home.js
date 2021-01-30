var express = require('express');
var router = express.Router();
require('dotenv').config();
var database = require("../database/connect");
const body_parser = require('body-parser');


router.use(body_parser.urlencoded({ extended: true }));
router.get('/', function(req, res, next) {
    if (req.session.user.logged_in == true) {
        var users = [];
        var images = [];
        var fame = [];
        var age = [];
        var id = [];

        productsQuery = "SELECT * FROM matcha.usersTable WHERE userID!=?";
        database.conn().query(productsQuery, req.session.user.id, function(err, result) {
            if (err) throw err;
            var data = result;
            imgs = "SELECT * FROM matcha.usersPicturesTable WHERE userID!=?";
            database.conn().query(imgs, req.session.user.id, function(err, result) {
                    if (err) throw err;
                    if (err) throw err;
                    for (var i = 0; i < data.length; i++) {
                        users.push(data[i].userName);
                        age.push(data[i].userAge);
                        fame.push(data[i].userFame);
                        images.push(result[i].wallpaper);
                    }
                    res.render('home', { users: users, age: age, img: images, fame: fame, id: id });
                })
                // products = result;
        });

    } else {
        res.redirect('/error');
    }
});

module.exports = router;