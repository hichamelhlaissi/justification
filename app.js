const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require("express-rate-limit");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const textCheckRouter = require('./routes/textCheck')
const signInRouter = require('./routes/signIn')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 100000000, // 15 minutes
  max: 1,
  message: "Too many accounts created from this IP, please try again after an hour"
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api/gettext", textCheckRouter,);
app.use('/api/signin', signInRouter);

app.use('/api/test',apiLimiter, (req, res) => {
  const moment = require('moment');
  let date = 1615864760336;
  let anotherDate = moment().valueOf();
  console.log(moment().subtract(24, 'hours').isAfter(date));
  console.log(moment().subtract(24, 'hours').isAfter(anotherDate));
  res.end()
})

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
