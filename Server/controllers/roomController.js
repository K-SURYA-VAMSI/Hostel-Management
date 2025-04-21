const register= require("../Db/register");
const Room = require('../models/Room');
const validator=require("validator")

module.exports.roomRegister=(req,res)=>{
    const {
        RoomNumber,
        floor,
        roomCapacity = 1,
        RoomRent,
        roomDescription = "Standard Room",
        roomFeatures = "Basic Amenities",
        Ac = false
    } = req.body;

    // Set FreeRooms equal to roomCapacity initially
    const FreeRooms = roomCapacity;

    // Validate required fields
    if (!RoomNumber || !floor || !RoomRent) {
        return res.status(400).json({ error: "Room Number, Floor, and Rent are required" });
    }

    const reg = new Room({
        RoomNumber,
        floor,
        roomCapacity,
        FreeRooms,
        RoomRent,
        roomDescription,
        roomFeatures,
        Ac
    });

    reg.save()
        .then((obj) => {
            console.log("Room successfully registered");
            res.status(201).json(obj);
        })
        .catch((error) => {
            console.log("Couldn't register room:", error);
            res.status(400).json({ error: error.message });
        });
}

module.exports.roomDetails = async (req, res) => {
    try {
        console.log('Fetching room details...');
        const roomData = await Room.find({});
        console.log('Found rooms:', roomData);
        
        if (!roomData || roomData.length === 0) {
            return res.status(404).json({ error: "No rooms found" });
        }

        res.json(roomData);
    } catch (error) {
        console.error("Error fetching room details:", error);
        res.status(500).json({ error: "Error fetching room details" });
    }
};

module.exports.roomUpdator=(req,res)=>{
    const RoomNumber=req.body.RoomNumber;
    const floor=req.body.floor;
    const RoomRent=req.body.rent;
    
    Room.updateOne({RoomNumber},{$set:{RoomNumber,floor,RoomRent}}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}

module.exports.roomDeletor=(req,res)=>{
    const RoomNumber=req.body.RoomNumber;

    Room.deleteOne({RoomNumber}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}

module.exports.feePayment = async (req, res) => {
    try {
        const { email, AmountPaid, BookedRoomNo, TimePeriod } = req.body;
        
        // Input validation
        if (!email || !AmountPaid || !BookedRoomNo || !TimePeriod) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (TimePeriod < 1 || TimePeriod > 12) {
            return res.status(400).json({ error: "Time period must be between 1 and 12 months" });
        }

        // Check if room exists and has space
        const room = await Room.findOne({ RoomNumber: BookedRoomNo });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        if (room.FreeRooms <= 0) {
            return res.status(400).json({ error: "Room is fully occupied" });
        }

        // Validate payment amount against room rent
        const expectedAmount = room.RoomRent * TimePeriod;
        if (AmountPaid < expectedAmount) {
            return res.status(400).json({ error: `Invalid payment amount. Expected: ${expectedAmount}` });
        }

        // Update room availability first
        const roomUpdate = await Room.updateOne(
            { 
                RoomNumber: BookedRoomNo,
                FreeRooms: { $gt: 0 } // Extra check to ensure room is still available
            },
            { $inc: { FreeRooms: -1 } }
        );

        if (!roomUpdate.matchedCount || !roomUpdate.modifiedCount) {
            return res.status(400).json({ error: "Room is no longer available" });
        }

        // Update user booking details
        const userUpdate = await register.updateOne(
            { email },
            { 
                $set: {
                    AmountPaid,
                    BookedRoomNo,
                    TimePeriod,
                    checkInDate: new Date(),
                    Active: true
                }
            }
        );

        if (!userUpdate.matchedCount) {
            // If user update fails, revert room update
            await Room.updateOne(
                { RoomNumber: BookedRoomNo },
                { $inc: { FreeRooms: 1 } }
            );
            return res.status(404).json({ error: "User not found" });
        }

        // Success response
        res.json({ 
            success: true,
            message: "Payment successful and room booked",
            bookingDetails: {
                roomNumber: BookedRoomNo,
                amount: AmountPaid,
                months: TimePeriod,
                checkInDate: new Date()
            }
        });

    } catch (error) {
        console.error("Payment error:", error);
        res.status(400).json({ 
            success: false,
            error: error.message || "Payment failed"
        });
    }
};

module.exports.feeRenewal=(req,res)=>{
    const email=req.body.name;
    const feeAmount=req.body.AmountPaid;
    const roomNumber=req.body.BookedRoomNo;
    const TimePeriod=req.body.TimePeriod;
    const checkInDate=new Date();

    register.updateOne({email:email},{$set:{AmountPaid:feeAmount,BookedRoomNo:roomNumber,TimePeriod:TimePeriod,checkInDate:checkInDate}}).then((result)=>{}).catch((e)=>{res.send(e);})
    
    res.json({"success":"ok"})

}

module.exports.roomUpdate=(req,res)=>{
    const roomRent=req.body.roomRent;
    const FreeRooms=req.body.FreeRooms;
    const OccupiedCount=req.body.OccupiedCount;
    Room.updateOne({RoomNumber:req.body.RoomNumber,floor:req.body.floor},{$set:{RoomRent:roomRent,FreeRooms:FreeRooms,OccupiedCount:OccupiedCount}}).then((result)=>{res.send(result);}).catch((e)=>{res.send(e);})
}