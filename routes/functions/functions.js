const nodemailer = require('nodemailer');
var database = require("../../database/connect");

//function for sending email
var done = 0;
var sendEmail = function (email, username, msg){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Account verification',
        text: 'Hello '+ username +"\n\n"+  msg
    };

    return transporter.sendMail(mailOptions, function(error, info, direct){
        if (error){
            console.log(error);
        }else{
            console.log('email sent');
        }
    });
}

//getting users gio location
var locateUser = function(){}

//method for image upload
const multer = require("multer");
var uploads = function (image, queryDB, id, call){}

module.exports = {sendEmail, uploads};