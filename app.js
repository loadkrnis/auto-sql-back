let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/user');
// let loginRouter = require('./routes/login');
let erdRouter = require('./routes/erd');
let commitRouter = require('./routes/commit');
let tokenRouter = require('./routes/token');
let sharedRouter = require('./routes/shared');
let sequelize = require('./models').sequelize;
let app = express();
const cors = require('cors')
sequelize.sync();
require('dotenv').config({ path: ".env" });
require('date-utils');

//sequelize setup

//end point


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
// app.use('/login', loginRouter);
app.use('/erd', erdRouter);
app.use('/commit', commitRouter);
app.use('/token', tokenRouter);
app.use('/shared', sharedRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let time = new Date();
console.log("server restarted at " + time.toFormat("YYYY-MM-DD HH24:MI:SS"));

module.exports = app;
