var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var confirmRouter = require('./routes/confirm');
var settingsRouter = require('./routes/settings');
var homeRouter = require('./routes/home');
var logoutRouter = require('./routes/logout');
var forgotRouter = require('./routes/forgot');
var userInfoRouter = require('./routes/userInfo');
var requestRouter = require('./routes/request');
var removerRouter = require('./routes/remove');
var notificationRouter = require('./routes/notification');

var app = express();

//sattings for the session 
app.use(session({
    secret: 'secret',
}))

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.errorMessages = req.session.errorMessages;
    next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/confirm', confirmRouter);
app.use('/settings', settingsRouter);
app.use('/home', homeRouter);
app.use('/logout', logoutRouter);
app.use('/forgot', forgotRouter);
app.use('/userInfo', userInfoRouter);
app.use('/request', requestRouter);
app.use('/remove', removerRouter);
app.use('/notification', notificationRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;