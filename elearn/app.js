var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost/elearn');
var db = mongoose.connection;
async = require('async');
var flash = require('connect-flash');
var Handlebars = require('handlebars');
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var app = express();

//Connect Flash
app.use(flash());

//Require Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classesRouter = require('./routes/classes');
var instructorsRouter = require('./routes/instructors');
var studentsRouter = require('./routes/students');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

//Middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Makes the user object global in all views
app.get('*', function(req,res,next) {
  // put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  if (req.user) {
    res.locals.type = req.user.type;
  }
  next();
});

//Express Validator
app.use(expressValidator({
  errorFormatter: function (param,msg,value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' +namespace.shift()+ ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Messages Global Var
app.use(function (req,res,next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Router Middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/instructors', instructorsRouter);
app.use('/students', studentsRouter);

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
