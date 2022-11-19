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
    const checkInDate=new Date();
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

// fetching user full details and sending to client
app.post('/userDetail',(req,res)=>{

    const email=req.body.email;

    if(!validator.isEmail(email))
    {
        res.send("Enter Valid Details to Login");
    }

    register.findOne({email:email}).then((data)=>{
        if(data){
            console.log(data)
         res.json({
            name:data.name,
            email:data.email,
            mobile:data.mobile,
            BookedRoom:data.BookedRoomNo,
            AmountPaid:data.AmountPaid,
            TimePeriod:data.TimePeriod,
            checkInDate:data.checkInDate
  
         })
        }
         else{
            res.json({response:"No user found with this values"});
         }
    }).catch((error)=>{
        res.send(error);
    });

});

// Rooms registration
app.post('/roomregister',(req,res)=>{

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

//fetching all users details 
app.get('/allusers',(req,res)=>{

    register.find({}).then((data)=>{
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
//updator
app.post('/updator',(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;
    
    register.updateOne({email:email},{$set:{email,name,mobile}}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

})

//deletor
app.post('/deletor',(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;

    register.deleteOne({email:email}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

})


// room updator
app.post('/roomupdator',(req,res)=>{
    const RoomNumber=req.body.RoomNumber;
    const floor=req.body.floor;
    const RoomRent=req.body.rent;
    
    rooms.updateOne({RoomNumber},{$set:{RoomNumber,floor,RoomRent}}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

})

// room deletor
app.post('/roomdeletor',(req,res)=>{
    const RoomNumber=req.body.RoomNumber;

    rooms.deleteOne({RoomNumber}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

})



app.post('/feePayment',(req,res)=>{
    const email=req.body.name;
    const feeAmount=req.body.AmountPaid;
    const roomNumber=req.body.BookedRoomNo;
    const TimePeriod=req.body.TimePeriod;

    register.updateOne({email:email},{$set:{AmountPaid:feeAmount,BookedRoomNo:roomNumber,TimePeriod:TimePeriod}}).then((result)=>{}).catch((e)=>{res.send(e);})
    rooms.updateOne({RoomNumber:roomNumber},{$inc:{FreeRooms:-1}}).then((result)=>{}).catch((e)=>{res.send(e);})

    res.json({"success":"ok"})

})

app.post('/feerenewal',(req,res)=>{
    const email=req.body.name;
    const feeAmount=req.body.AmountPaid;
    const roomNumber=req.body.BookedRoomNo;
    const TimePeriod=req.body.TimePeriod;
    const checkInDate=new Date();

    register.updateOne({email:email},{$set:{AmountPaid:feeAmount,BookedRoomNo:roomNumber,TimePeriod:TimePeriod,checkInDate:checkInDate}}).then((result)=>{}).catch((e)=>{res.send(e);})
    
    res.json({"success":"ok"})

})

// User Details update
app.post('/userupdate',(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;
    const roomNumber=req.body.BookedRoomNo;
    
    register.updateOne({email:email},{$set:{mobile:mobile,email:email,name:name,BookedRoomNo:roomNumber}}).then((result)=>{ res.send(result)}).catch((e)=>{res.send(e);})
   
})


// To update room details
app.post('/roomUpdate',(req,res)=>{
    const roomRent=req.body.roomRent;
    const FreeRooms=req.body.FreeRooms;
    const OccupiedCount=req.body.OccupiedCount;
    rooms.updateOne({RoomNumber:req.body.RoomNumber,floor:req.body.floor},{$set:{RoomRent:roomRent,FreeRooms:FreeRooms,OccupiedCount:OccupiedCount}}).then((result)=>{res.send(result);}).catch((e)=>{res.send(e);})
})
// Here im importing all routes which i have mentioned in route.js file 
app.use(require(path.join(__dirname,"/Routes/route.js")));

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})