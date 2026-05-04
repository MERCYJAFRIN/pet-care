const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MongoUser', // Correctly refer to the Mongo model
    required: true
  }
}, {
  timestamps: true
});

const Pet = mongoose.model('MongoPet', petSchema);
module.exports = Pet;
