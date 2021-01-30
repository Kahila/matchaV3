var express = require('express');
var router = express.Router();
const body_parser = require('body-parser');
var database = require("../database/connect");
var methods = require("./functions/functions");

router.use(body_parser.urlencoded({ extended: true }));
router.get('/accept', function(req, res, next) {
    var selectQuery = "UPDATE matcha.usersMatchesTable SET matched=0 WHERE userID_one=" + req.query.id + " AND userID_two=?";
    database.conn().query(selectQuery, req.session.user.id, function(err, result) {
        if (err) throw err;
        var deleteQuery = "DELETE FROM matcha.usersNotificationTable WHERE userID=" + req.session.user.id + " AND senderID=?";
        database.conn().query(deleteQuery, req.query.id, function(err, result) {
            if (err) throw err;
            res.redirect('back');
        })
    });
});

module.exports = router;