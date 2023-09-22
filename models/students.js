const  mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: [String],
    required: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profile: String,

  level: {
    type: String,
    required: true,
  },


  gender: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model('Student', schema);
module.exports =  Student;
