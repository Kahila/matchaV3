var express = require('express');
var router = express.Router();
require('dotenv').config();
var database = require("../database/connect");
const body_parser = require('body-parser');

var wallpaper = "";
var friend = "";
var massages = [];
var id = 0;
router.use(body_parser.urlencoded({ extended: true }));
router.post('/chat', function(req, res, next) {
    insert = "INSERT INTO matcha.usersChatTable (userID, senderID, message) VALUES (" + id + ", " + req.session.user.id + ", ?)";
    database.conn().query(insert, req.body.chat, function(err, result) {
        if (err) throw err;
        res.redirect("back");
    })
})

router.get('/chat', function(req, res, next) {
    img = "SELECT wallpaper FROM matcha.usersPicturesTable WHERE userID=?";
    database.conn().query(img, req.session.user.id, function(err, result) {
        if (err) throw err;
        wallpaper = result[0].wallpaper;
        database.conn().query(img, req.query.id, function(err, result) {
            if (err) throw err;
            friend = result[0].wallpaper;
            id = req.query.id;
            chats = "SELECT * FROM matcha.usersChatTable WHERE userID=" + req.session.user.id + " AND senderID=?";
            database.conn().query(chats, req.query.id, function(err, result) {
                if (err) throw err;
                for (var item in result) {
                    massages.push(result[item].message);
                }
                console.log(result);
                res.render('chat', { wallpaper: wallpaper, friend: friend, message: massages });
            })
        })
    })
});

module.exports = router;