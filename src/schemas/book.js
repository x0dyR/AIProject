const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title:        { type: String, required: true },
  authors:      [{ type: Schema.Types.ObjectId, ref: 'Author' }],
  categories:   [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  description:  { type: String },
  publishYear:  { type: Number },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
