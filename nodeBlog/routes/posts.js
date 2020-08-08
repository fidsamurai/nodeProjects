var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});
//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog', {useNewUrlParser: true});
var db = mongoose.connection;
var categories = require('../db/categories');
var posts = require('../db/posts');

//Routes
router.get('/show/:id', function(req, res, next) {
  posts.findById(req.params.id, function(err, post) {
    res.render('show', {
      post: post
    });
  });
});

router.get('/add', function(req, res, next) {
  categories.find(function(err, categories) {
    res.render('addpost', {
      'title': 'Add Post',
      'categories': categories
    });
  });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  //Get form values
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

//Check to see if there is a file
  if (req.file) {
    var mainimage = req.file.filename;
  } else {
    var mainimage = 'noimage.jpg';
  };

//Form Validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

//Check Errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('addpost', {
      "errors": errors
    });
  } else {
     db.collection('posts').insert({
       "title": title,
       "body": body,
       "category": category,
       "date": date,
       "author": author,
       "mainimage": mainimage
     }, function(err, post) {
       if (err) {
         res.send(err);
       } else {
         req.flash('success', 'Post Added');
         res.location('/');
         res.redirect('/')
       }
     });
  }
});

router.post('/addcomment', function(req, res, next) {
  //Get form values
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  var commentdate = new Date();

//Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required but never displayed').notEmpty();
  req.checkBody('email', 'Email is not formatted correctly').isEmail();
  req.checkBody('body', 'Body field is required').notEmpty();

//Check Errors
  var errors = req.validationErrors();

  if (errors) {
    db.posts.findById({'_id': postid}, function(err, post) {
      res.render('show', {
        "errors": errors,
        "post": post
    });
  });
  } else {
    var comment = {
      "name": name,
      "email": email,
      "body": body,
      "commentdate": commentdate
    };

  posts.findByIdAndUpdate(postid, {$push: {comments: {comment}}}, function(err,comments) {
      if (err) {
        throw err;
      } else {
        req.flash('success', 'Comment Added');
        res.location('/posts/show/'+postid);
        res.redirect('/posts/show/'+postid);
      }
    });
  }
});
module.exports = router;
