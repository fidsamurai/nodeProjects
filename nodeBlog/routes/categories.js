var express = require('express');
var router = express.Router();

//Mongoose Setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog', {useNewUrlParser: true});
var db = mongoose.connection;
var posts = require('../db/posts');

//Routes
router.get('/show/:category', function(req, res, next) {
  posts.find({category: req.params.category}, function(err, posts) {
    res.render('index', {
      'title': req.params.category,
      'posts': posts
    })
  })
});

router.get('/add', function(req, res, next) {
  res.render('addcategory', {
      'title': 'Add Category'
  });
});

//Post
router.post('/add', function(req,res,next) {
  //Get form Values
  var name = req.body.name;

  //Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();

  //Check Errors
    var errors = req.validationErrors();

    if (errors) {
      res.render('addpost', {
        "errors": errors
      });
    } else {
       db.collection('categories').insert({
         "name": name
       }, function(err, post) {
         if (err) {
           res.send(err);
         } else {
           req.flash('success', 'Category Added');
           res.location('/');
           res.redirect('/')
         }
       });
    }
});

module.exports = router;
