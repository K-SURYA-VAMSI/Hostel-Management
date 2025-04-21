const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  RoomNumber: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: String,
    required: true
  },
  RoomRent: {
    type: String,
    required: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema); 