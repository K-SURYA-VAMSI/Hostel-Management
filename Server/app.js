const express=require('express');
const app=express();
const port=8000;
require("dotenv").config()

 const userController=require("./controllers/userController")
 const roomController=require("./controllers/roomController")

// establishing Database Connection
const mongoose=require('mongoose');
const url=process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log("connection Done")
}).catch((error)=>{
    console.log("connection failed")
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.get('/',(req,res)=>{
    res.status(200).json(({status:"ok"}))
})

// User registration 
app.post('/register', userController.register)

// i have to login as Admin and Accept new Registrations by validating, for now im allowing all after wards i set Validation system
app.post('/login',userController.login);

// fetching user full details and sending to client
app.post('/userDetail',userController.userDetails);

// User Details update
app.post('/userupdate',userController.userDetailsUpdate)

//fetching all users details 
app.get('/allusers',userController.allUsers)

//updator
app.post('/updator',userController.updator)

//deletor
app.post('/deletor',userController.deletor)

// Rooms registration
app.post('/roomregister',roomController.roomRegister)

// fetching and sending full collection data
app.get('/roomDetail',roomController.roomDetails)

// room updator
app.post('/roomupdator',roomController.roomUpdator)

// room deletor
app.post('/roomdeletor',roomController.roomDeletor)

app.post('/feePayment',roomController.feePayment)

app.post('/feerenewal',roomController.feeRenewal)

// To update room details
app.post('/roomUpdate',roomController.roomUpdate)


app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})