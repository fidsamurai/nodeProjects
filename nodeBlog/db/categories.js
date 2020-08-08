//Mongoose Setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;

//Categories Schema
var categories = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('categories', categories);
