var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var doctorsRouter = require('./routes/doctors');
var categoriesRouter = require('./routes/categories');

var app = express();

//Cassandra Setup
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
});
client.connect(function(err,result) {
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Search by category
var query = "SELECT * FROM findadoc.categories";
client.execute(query, [], function(err,results) {
  if (err) {
    res.status(404).send({msg: err});
  }else {
    app.locals.cats = results.rows;
  }
});

//Middleware routes
app.use('/', indexRouter);
app.use('/doctors', doctorsRouter);
app.use('/categories', categoriesRouter);

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
});

app.set('port', (process.env.PORT || 1337));
app.listen(app.get('port'), function() {
  console.log('Sever started on port: '+app.get('port'));
});
module.exports = app;
