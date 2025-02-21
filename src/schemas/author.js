const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
  name:      { type: String, required: true },
  bio:       { type: String },
  birthdate: { type: Date }
});

module.exports = mongoose.model('Author', authorSchema);
