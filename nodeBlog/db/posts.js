//Mongoose Setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog', {useNewUrlParser: true});
var db = mongoose.connection;
var Schema = mongoose.Schema;

//Posts Model
var posts = mongoose.Schema({
  title: String,
  body: String,
  category: String,
  author: String,
  body: String,
  date: {type: Date, default: Date.now},
  mainimage: String
});

module.exports = mongoose.model('posts', posts);
