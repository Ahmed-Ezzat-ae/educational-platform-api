const { Schema, model } = require('mongoose');
const schema = new Schema({
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

  material: {
    type: 'String',
    required: true,
  },
});

const Teacher = model('Teacher', schema);
module.exports = Teacher;
