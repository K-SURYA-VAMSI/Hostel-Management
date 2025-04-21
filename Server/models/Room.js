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
    type: Number,
    required: true
  },
  roomCapacity: {
    type: Number,
    required: true,
    default: 1
  },
  FreeRooms: {
    type: Number,
    required: true
  },
  roomDescription: {
    type: String,
    default: "Standard Room"
  },
  roomFeatures: {
    type: String,
    default: "Basic Amenities"
  },
  ac: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add a pre-save middleware to set FreeRooms equal to roomCapacity if not specified
roomSchema.pre('save', function(next) {
  if (this.isNew && this.FreeRooms === undefined) {
    this.FreeRooms = this.roomCapacity;
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema); 
module.exports = mongoose.model('Room', roomSchema); 