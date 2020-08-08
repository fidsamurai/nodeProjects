var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

//Mongoose Setup
var mongoose = require('mongoose');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog', {useNewUrlParser: true});
var db = mongoose.connection;

var posts =  require('../db/posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  posts.find(function(err, posts) {
    res.render('index', {posts: posts});
  });
});

module.exports = router;
