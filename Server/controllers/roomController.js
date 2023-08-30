const register= require("../Db/register");
const rooms=require("../Db/Rooms");
const validator=require("validator")

module.exports.roomRegister=(req,res)=>{

    const RoomNumber=req.body.RoomNumber;
    const floor=req.body.floor;
    const roomCapacity=req.body.roomCapacity;
    const FreeRooms=roomCapacity;
    const RoomRent=req.body.RoomRent;
    const roomDescription=req.body.roomDescription;      
    const roomRating=req.body.roomRating;
    const roomFeatures=req.body.roomFeatures;
    const Ac=req.body.Ac;

if(RoomNumber===""||floor===""||FreeRooms===""||roomCapacity===""||RoomRent===""||roomDescription===""||roomRating===""||roomFeatures===""||Ac==="")
{
    res.send("Enter Valid Details to register");
}
   const reg=new rooms({RoomNumber:RoomNumber,floor:floor,roomCapacity:roomCapacity,
    FreeRooms:FreeRooms,RoomRent:RoomRent,roomDescription:roomDescription,
    roomRating:roomRating,roomFeatures:roomFeatures,Ac:Ac});

   reg.save().then((obj)=>{console.log("rooms successfully registered");
   res.send(obj); //redirect to Login Page and dont allow him to book rooms now itself
}).catch((error)=>{
    console.log("couldn't registered");
    res.send(error); 
});
}

module.exports.roomDetails=(req,res)=>{

    rooms.find({}).then((data)=>{
        if(data){
         res.send(data);
         console.log("request came")
        }
         else{
            res.send("error in fetching");
         }
    }).catch((error)=>{
        res.send(error,`Error occured while Login`);
    });
}

module.exports.roomUpdator=(req,res)=>{
    const RoomNumber=req.body.RoomNumber;
    const floor=req.body.floor;
    const RoomRent=req.body.rent;
    
    rooms.updateOne({RoomNumber},{$set:{RoomNumber,floor,RoomRent}}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}

module.exports.roomDeletor=(req,res)=>{
    const RoomNumber=req.body.RoomNumber;

    rooms.deleteOne({RoomNumber}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}

module.exports.feePayment=(req,res)=>{
    const email=req.body.name;
    const feeAmount=req.body.AmountPaid;
    const roomNumber=req.body.BookedRoomNo;
    const TimePeriod=req.body.TimePeriod;

    register.updateOne({email:email},{$set:{AmountPaid:feeAmount,BookedRoomNo:roomNumber,TimePeriod:TimePeriod}}).then((result)=>{}).catch((e)=>{res.send(e);})
    rooms.updateOne({RoomNumber:roomNumber},{$inc:{FreeRooms:-1}}).then((result)=>{}).catch((e)=>{res.send(e);})

    res.json({"success":"ok"})

}

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
    rooms.updateOne({RoomNumber:req.body.RoomNumber,floor:req.body.floor},{$set:{RoomRent:roomRent,FreeRooms:FreeRooms,OccupiedCount:OccupiedCount}}).then((result)=>{res.send(result);}).catch((e)=>{res.send(e);})
}