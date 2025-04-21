const express=require('express');
const app=express();
const port=8000;
const cors = require('cors');
require("dotenv").config()

const userController=require("./controllers/userController")
const roomController=require("./controllers/roomController")
const adminController=require("./controllers/adminController")

// establishing Database Connection
const mongoose=require('mongoose');
const url=process.env.MONGO_URL || 'mongodb://localhost:27017/hostelManagement';
console.log('Attempting to connect to MongoDB at:', url);

mongoose.connect(url).then(()=>{
    console.log("MongoDB Connection Successful");
    console.log("Database Name:", mongoose.connection.name);
}).catch((error)=>{
    console.error("MongoDB Connection Failed:", error);
});

// Enable CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Basic route
app.get('/',(req,res)=>{
    res.status(200).json(({status:"ok"}))
})

// Test route to check MongoDB connection
app.get('/api/test', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ 
            status: 'ok',
            dbConnected: mongoose.connection.readyState === 1,
            collections: collections.map(c => c.name)
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message
        });
    }
});

// User routes
app.post('/register', userController.register)
app.post('/login', userController.login);
app.post('/userDetail', userController.userDetails);
app.post('/userupdate', userController.userDetailsUpdate)

// Admin routes
app.get('/admin/users', adminController.getAllUsers);
app.post('/admin/users/update', adminController.updateUser);
app.post('/admin/users/delete', adminController.deleteUser);

// Room management routes
app.post('/admin/rooms/create', adminController.createRoom);
app.post('/admin/rooms/update', adminController.updateRoom);
app.post('/admin/rooms/delete', adminController.deleteRoom);
app.get('/admin/rooms', adminController.getAllRooms);

// Existing room routes
app.post('/roomregister', roomController.roomRegister)
app.get('/roomDetail', roomController.roomDetails)
app.post('/roomupdator', roomController.roomUpdator)
app.post('/roomdeletor', roomController.roomDeletor)
app.post('/feePayment', roomController.feePayment)
app.post('/feerenewal', roomController.feeRenewal)
app.post('/roomUpdate', roomController.roomUpdate)

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});