const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
// let loginRouter = require('./routes/login');
const erdRouter = require('./routes/erd');
const commitRouter = require('./routes/commit');
const tokenRouter = require('./routes/token');
const sharedRouter = require('./routes/shared');
const sequelize = require('./models').sequelize;
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' });

app.use(jsonParser);
app.use(urlencodedParser);
const cors = require('cors');
sequelize.sync();
require('dotenv').config({ path: '.env' });
require('date-utils');

// sequelize setup

// end point


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://autosql.ga');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  next();
});
app.use(cors());
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
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const time = new Date();
console.log('server restarted at ' + time.toFormat('YYYY-MM-DD HH24:MI:SS'));

module.exports = app;
