const register = require("../Db/register");
const rooms = require("../Db/Rooms");
const Room = require('../models/Room');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await register.findOne({ email: req.body.email, isAdmin: true });
        if (!user) {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all users (admin only)
module.exports.getAllUsers = async (req, res) => {
    try {
        console.log('Getting all users...');
        const allUsers = await register.find({ isAdmin: false });
        console.log(`Found ${allUsers.length} users`);
        res.json(allUsers);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ error: "Error fetching users", details: error.message });
    }
};

// Update user details (admin only)
module.exports.updateUser = async (req, res) => {
    try {
        const { userId, updates } = req.body;
        console.log('Updating user:', userId, 'with:', updates);
        
        const updatedUser = await register.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        console.log('User updated successfully:', updatedUser);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ error: "Error updating user", details: error.message });
    }
};

// Delete user (admin only)
module.exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log('Deleting user:', userId);
        
        const deletedUser = await register.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        console.log('User deleted successfully');
        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
};

// Room Management Functions

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        console.log('Fetching all rooms...');
        const rooms = await Room.find({});
        console.log(`Found ${rooms.length} rooms`);
        res.json(rooms);
    } catch (error) {
        console.error('Error in getAllRooms:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new room
exports.createRoom = async (req, res) => {
    try {
        // Set default values and ensure FreeRooms is set
        const roomData = {
            ...req.body,
            roomCapacity: req.body.roomCapacity || 1,
            FreeRooms: req.body.FreeRooms || req.body.roomCapacity || 1,
            roomDescription: req.body.roomDescription || "Standard Room",
            roomFeatures: req.body.roomFeatures || "Basic Amenities",
            ac: req.body.ac || false
        };

        const room = new Room(roomData);
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        console.error('Error in createRoom:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    try {
        const { roomId, updates } = req.body;
        
        // Set default values if not provided
        const roomData = {
            ...updates,
            roomCapacity: updates.roomCapacity || 1,
            FreeRooms: updates.FreeRooms || updates.roomCapacity || 1,
            roomDescription: updates.roomDescription || "Standard Room",
            roomFeatures: updates.roomFeatures || "Basic Amenities",
            ac: updates.ac || false
        };

        console.log('Updating room:', roomId, 'with:', roomData);
        
        const room = await Room.findByIdAndUpdate(
            roomId, 
            { $set: roomData },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        console.error('Error in updateRoom:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        console.log('Deleting room:', roomId);
        
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error in deleteRoom:', error);
        res.status(500).json({ message: error.message });
    }
}; 