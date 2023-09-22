const { Schema, model } = require('mongoose');
const schema = new Schema({
  logoImg: String,
  title: String,
  desc: String,
  descImg: String,
});

const Content = model('Content', schema);
module.exports = Content;
