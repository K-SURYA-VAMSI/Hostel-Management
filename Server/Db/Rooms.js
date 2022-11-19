const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    RoomNumber:{
        type:Number
    },
    floor:{
        type:Number
    },
    roomCapacity:{
        type:Number
    },
    FreeRooms:{
        type:Number
    },
    RoomRent:{
        type:Number
    },
    roomDescription:{
        type:String
    },
    roomRating:{
        type:Number
    },
    roomFeatures:{ // Delux (or) Non-Delux
        type:String
    },
    ac:{
        type:Boolean
    }
});

const rooms=new mongoose.model('roomDetail',userSchema);

module.exports=rooms;