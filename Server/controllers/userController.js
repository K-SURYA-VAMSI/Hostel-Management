const register= require("../Db/register");
const rooms=require("../Db/Rooms");
const validator=require("validator")


module.exports.register=(req,res)=>{
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
}

module.exports.login=(req,res)=>{

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

}

module.exports.userDetails=(req,res)=>{

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

}

module.exports.userDetailsUpdate=(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;
    const roomNumber=req.body.BookedRoomNo;
    
    register.updateOne({email:email},{$set:{mobile:mobile,email:email,name:name,BookedRoomNo:roomNumber}}).then((result)=>{ res.send(result)}).catch((e)=>{res.send(e);})
   
}

module.exports.allUsers=(req,res)=>{

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
}

module.exports.updator=(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;
    
    register.updateOne({email:email},{$set:{email,name,mobile}}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}

module.exports.deletor=(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const mobile=req.body.mobile;

    register.deleteOne({email:email}).then((result)=>{res.send(result)}).catch((e)=>{res.send(e);})

}