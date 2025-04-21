const express = require('express');
const path = require('path');
const Router = express.Router();
const Room = require('../models/Room');

// Get all rooms
Router.get('/admin/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room
Router.post('/admin/rooms/update', async (req, res) => {
  try {
    const { roomId, updates } = req.body;
    const room = await Room.findByIdAndUpdate(roomId, updates, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete room
Router.post('/admin/rooms/delete', async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Router;