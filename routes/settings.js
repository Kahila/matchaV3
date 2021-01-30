var express = require('express');
const body_parser = require('body-parser');
const router = express.Router();
var database = require("../database/connect");
const multer = require("multer");
require('dotenv').config();
const path = require("path");

//validation based variables
var gender = 0,
    pref = 0,
    tag = 0,
    bio = 0,
    gio = 0,
    age = 0;
//setting up the upload of the images
var submitted = 0;
var bbio = null;
var gioL = 0;
var methods = require("./functions/functions"); //email lib

/// image upload with multer
var img = "";
var submitted = 0;
var tmp = "";
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/uploads')
    },
    filename: function(req, file, cb) {
        tmp = file.fieldname + '-' + Date.now() + ".jpg";
        var path = "/images/uploads/";
        cb(null, tmp);
        img = path + tmp;
        console.log(img);
    }
})
var upload = multer({ storage: storage })

router.use(body_parser.urlencoded({ extended: true }));
router.post('/settings', upload.single('img'), function(req, res, next) {
    if (req.session.user.logged_in == true) {
        //checking if content has been selected
        if (req.body.tag == "t") {
            tag = 1;
        }
        if (req.body.gender == "t") {
            gender = 1;
        }
        if (req.body.pref == "t") {
            pref = 1;
        }
        if (req.body.gio == "t") {
            gio = 1;
        }
        if (req.body.bio == "") {
            bio = 1;
        }
        if (req.body.age == "0") {
            age = 1;
        }
        if (tag == 1 || gender == 1 || pref == 1 || bio == 1 || gio == 1 || submitted == 1 || age == 1) {
            res.redirect("back");
        } else {
            if (req.body.gio == "yes") { gioL = 0 } else { gioL = 1 }
            //inserting tags
            var interest = "INSERT INTO matcha.usersInterestTagsTable (userID, interest) VALUES (\"" + req.session.user.id + "\", \"" + req.body.tag + "\")";
            var userInfo = "UPDATE matcha.usersTable SET `userGender`=\"" + req.body.gender + "\", `userAge`=\"" + req.body.age + "\", `userSexualPreference`=\"" + req.body.pref + "\", \
        `userBio`=\"" + req.body.bio + "\", `userLocation`=\"" + 0 + "\", `userTracker`=\"" + gioL + "\" WHERE userID=?";
            database.conn().query(interest, function(err, result) {
                if (err) throw err;
                database.conn().query(userInfo, req.session.user.id, function(err, result, next) {
                    if (err) throw err;
                    const file = req.body.img; //image upload
                    // quary
                    if (tmp == "") {
                        console.log("nothing was submitted");
                        res.redirect("back");
                    } else {
                        //adding image to database
                        var imgUpload = "INSERT INTO matcha.usersPicturesTable (userID, wallpaper) VALUES (\"" + req.session.user.id + "\", \"" + img + "\")"
                        database.conn().query(imgUpload, req.session.user.id, function(err, result) {
                            if (err) throw err;
                            //update verification table
                            var verify = "UPDATE matcha.usersVerificationTable SET `verificationCode`=\"0\" WHERE userID=?";
                            database.conn().query(verify, req.session.user.id, function(err, result) {
                                if (err) throw err;
                                methods.sendEmail(req.session.user.email, req.session.user.uname, 'Account Information Has just Been Updated');
                                res.redirect("/home");
                            })
                        })
                    }
                })
            })
        }

    } else {
        res.redirect('/error');
    }
});

router.get('/', function(req, res, next) {
    res.render('settings', { tag: tag, gender: gender, pref: pref, bio: bio, gio: gio, img: submitted, about: bbio, age: age });
    gender = pref = tag = bio = gio = age = 0;
});

module.exports = router;