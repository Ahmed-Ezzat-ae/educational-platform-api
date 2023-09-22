const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
    maxLength: 15,
  },

  password: {
    type: String,
    required: true,
  },

  mainAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  profile: {
    type: String,
  },
  phone: {
    required: true,
    type: [String],
  }
}, {
  timestamps: true
});

const Admin = model('Admin', schema);
module.exports = Admin;
