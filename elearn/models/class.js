var mongoose = require('mongoose');

var ClassSchema = mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  lessons: [{
    lesson_number: {type: Number},
    lesson_title: {type: String},
    lesson_body: {type: String}
  }]
});

var Class = module.exports = mongoose.model('classes', ClassSchema);

//Fetch All Classes
module.exports.getClasses = function (callback, limit) {
  Class.find(callback).limit(limit).lean();
};

//Fetch Single class
module.exports.getClassById = function (id,callback) {
  Class.findById(id,callback).lean();
};

//Add Lesson
module.exports.addLesson = function (info,callback) {
  class_id = info['class_id'];
  lesson_number = info['lesson_number'];
  lesson_title = info['lesson_title'];
  lesson_body = info['lesson_body'];

  Class.findByIdAndUpdate (
    class_id,
    {$push: {"lessons": {lesson_number: lesson_number, lesson_title: lesson_title, lesson_body: lesson_body}}},
    {safe: true, upsert: true},
    callback
  );
};
