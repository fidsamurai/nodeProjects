var mongoose = require('mongoose');

var StudentSchema = mongoose.Schema({
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

var Student = module.exports = mongoose.model('students', StudentSchema);

module.exports.getStudentByUsername = function (username, callback) {
  var query = {username: username};
  Student.findOne(query, callback);
}
