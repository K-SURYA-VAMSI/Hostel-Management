const express=require('express');
const path=require('path');
const app=express();
const Router=express.Router();
const port=8000;
const validator=require('validator');


 const register= require(path.join(__dirname,"Db/register.js"));
 const rooms=require(path.join(__dirname,"Db/Rooms.js"));

// establishing Database Connection
const mongoose=require('mongoose');
const ok='mongodb+srv://saiprasad:saiprasad@cluster0.huuoxxb.mongodb.net/mernstack?retryWrites=true&w=majority';
mongoose.connect(ok).then(()=>{
    console.log("connection Done")
}).catch((error)=>{
    console.log("connection failed")
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'hbs')

app.get('/',(req,res)=>{
    res.render("index");
})

// User registration 
app.post('/register', (req,res)=>{
    console.log(req.body);
    const aadharNumber=req.body.aadarCard;
    const panCard=req.body.panCard;
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    const mobile=req.body.mobile;
    const AmountPaid=0;
    const BookedRoomNo=0;
    const Active=true;   // will be set to True after fee payment and checkIn
    const TimePeriod=0;
    const checkInDate="2022-10-18";
    const adminApproval=false;  // Admin have to approve Users account

   const reg=new register({name,email,mobile,aadharNumber,panCard,password,AmountPaid,TimePeriod,BookedRoomNo,checkInDate,Active,adminApproval});

   reg.save().then((obj)=>{console.log("successfully registered");
   res.status(200).send(obj); //redirect to Login Page and dont allow him to book rooms now itself
}).catch((error)=>{
    console.log("couldn't registered");
    res.send(error); 
});
})

// i have to login as Admin and Accept new Registrations by validating, for now im allowing all after wards i set Validation system
app.post('/login',(req,res)=>{

    const email=req.body.email;
    const password=req.body.password;
   
    if(!validator.isEmail(email)||password==="")
    {
        res.send("Enter Valid Details to Login");
    }

    register.findOne({email:email,password:password}).then((data)=>{
        if(data){
         res.send(data);
        }
         else{
            res.send("No user found with this values");
         }
    }).catch((error)=>{
        res.send(error);
    });

});
// Rooms registration
app.post('/roomregister',(req,res)=>{

    const RoomNumber=req.body.RoomNumber;
    const floor=req.body.floor;
    const FreeRooms=req.body.FreeRooms;
    const OccupiedCount=req.body.OccupiedCount;
    const roomCapacity=req.body.roomCapacity;
    const RoomRent=req.body.RoomRent;
    const roomDescription=req.body.roomDescription;      
    const roomRating=req.body.roomRating;
    const roomFeatures=req.body.roomFeatures;
    const Ac=req.body.Ac;

if(RoomNumber===""||floor===""||FreeRooms===""||OccupiedCount===""||roomCapacity===""||RoomRent===""||roomDescription===""||roomRating===""||roomFeatures===""||Ac==="")
{
    res.send("Enter Valid Details to register");
}
   const reg=new rooms({RoomNumber:RoomNumber,floor:floor,roomCapacity:roomCapacity,
    FreeRooms:FreeRooms,OccupiedCount:OccupiedCount,RoomRent:RoomRent,roomDescription:roomDescription,
    roomRating:roomRating,roomFeatures:roomFeatures,Ac:Ac});

   reg.save().then((obj)=>{console.log("rooms successfully registered");
   res.send("rooms successfully registered"); //redirect to Login Page and dont allow him to book rooms now itself
}).catch((error)=>{
    console.log("couldn't registered");
    res.send("registration Failed !!!"); 
});
})

// fetching and sending full collection data
app.get('/roomDetail',(req,res)=>{

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
})

// To update room details
app.patch('/roomUpdate',(req,res)=>{
    const roomRent=req.body.roomRent;
    const FreeRooms=req.body.FreeRooms;
    const OccupiedCount=req.body.OccupiedCount;
    rooms.updateOne({RoomNumber:req.body.RoomNumber,floor:req.body.floor},{$set:{RoomRent:roomRent,FreeRooms:FreeRooms,OccupiedCount:OccupiedCount}}).then((res)=>{res.send("update done");}).catch((e)=>{res.send(e);})
})
// Here im importing all routes which i have mentioned in route.js file 
app.use(require(path.join(__dirname,"/Routes/route.js")));

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})