var express = require('express');
var router = express.Router();
const body_parser = require('body-parser');
var database = require("../database/connect");
var methods = require("./functions/functions");

router.use(body_parser.urlencoded({ extended: true }));
router.get('/remove', function(req, res, next) {
    //remove the user from the friendlist
    var deleteQuery = "DELETE FROM matcha.usersMatchesTable WHERE userID_one=\"" + req.session.user.id + "\" AND userID_two=\"" + req.query.id + "\";";
    database.conn().query(deleteQuery, function(err, result) {
        if (err) throw err;
        console.log(deleteQuery);
        if (typeof result[0] == "undefined") {
            var deleteQuery = "DELETE FROM matcha.usersMatchesTable WHERE userID_one=" + req.query.id + " AND userID_two=?";
            database.conn().query(deleteQuery, req.session.user.id, function(err, result) {
                if (err) throw err;
                res.redirect('back');
            })
        } else {
            res.redirect('back');
        }
    });
});

module.exports = router;