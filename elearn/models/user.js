var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//UserSchema
var UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: {
    type: String,
    bcrypt: true
  },
  type: String
});

var User = module.exports = mongoose.model('users', UserSchema);

//Get User By Id
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

//Get User by Username
module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
}

//Compare Password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

//Create Student User
module.exports.saveStudent = function (newUser, newStudent, callback) {
  bcrypt.hash(newUser.password, 10).then(function (hash) {
    //Set Hash
    newUser.password = hash
    console.log('Student is being saved')
    return Promise.all([newUser.save(), newStudent.save()]);
  }, function (err) {
    console.log(err);
    return Promise.reject();
  })
};

//Create Instructor User
module.exports.saveInstructor = function (newUser, newInstructor, callback) {
  bcrypt.hash(newUser.password, 10).then(function (hash) {
    //Set Hash
    newUser.password = hash
    console.log('Instructor is being saved')
    return Promise.all([newUser.save(), newInstructor.save()]);
  }, function (err) {
    console.log(err);
    return Promise.reject();
  })
};
