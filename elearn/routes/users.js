var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Include User Model
var User = require('../models/user');
//Include Student Model
var Student = require('../models/student');
//Include Instructor Model
var Instructor = require('../models/instructor');

//User Register
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

//POST
//User Registration
router.post('/register', function(req,res,next) {
  //Form Values
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var street_address = req.body.street_address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;

  //Validation
  req.checkBody('first_name', 'First name field is required').notEmpty();
  req.checkBody('last_name', 'Last name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  errors = req.validationErrors();

  req.flash('success_msg', 'User Added');
  res.redirect('/');

  if (errors) {
    res.render('users/register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      email: email,
      username: username,
      password: password,
      type: type
    });

    if (type == 'student') {
      console.log('Registering Student');

      var newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        email: email,
        username: username
       });

      User.saveStudent(newUser, newStudent).then(function(result) {
        console.log('Student Created');
      });

    } else {
      console.log('Registering Instructor');

      var newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        address: [{
          street_address: street_address,
          city: city,
          state: state,
          zip: zip
        }],
        username: username,
        email: email
       });

      User.saveInstructor(newUser, newInstructor).then(function(result) {
        console.log('Instructor Created');
      });
    }
  }
});

router.post('/login', passport.authenticate('local',{failureRedirect: '/', failureFlash: true}),
function (req,res,next) {
  req.flash('success_msg', 'You are now logged in');
  var usertype = req.user.type;
  res.redirect('/'+usertype+'s/classes');
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err,user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown user ' + username});
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid Password');
          //Success Message
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.getUserById(_id, function (err, user) {
     if (err) {
       done(null, false, {error:err});
     } else {
        done(null, user); 
     }
  });
});

//Logout User
router.get('/logout', function (req,res) {
  req.logout();
  //Success Message
  req.flash('success_msg', "You have successfully logged out");
  res.redirect('/');
});

module.exports = router;
