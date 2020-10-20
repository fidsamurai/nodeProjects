var mongoose = require('mongoose');

var InstructorSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  address: [{
    street_address: String,
    city: String,
    state: String,
    zip: String
  }],
  username: String,
  email: String,
  classes:[{
    class_id: {type: [mongoose.Schema.Types.ObjectId]},
    class_title: String
  }]
});

var Instructor = module.exports = mongoose.model('instructors', InstructorSchema);

module.exports.getInstructorByUsername = function (username, callback) {
  var query = {username: username};
  Instructor.findOne(query, callback);
}

module.exports.register = function (info, callback) {
  instructor_username = info['instructor_username'];
  class_id = info['class_id'];
  class_title = info['class_title'];

  var query = {username: instructor_username};
  Instructor.findOneAndUpdate(
    query,
    {$push: {"classes": {class_id: class_id, class_title: class_title}}},
    {safe: true, upsert: true},
    callback
  );
}
