const mongoose = require('mongoose');
const register = require('./Db/register');
require('dotenv').config();

const adminUser = {
    name: "Admin",
    email: "admin@hostel.com",
    mobile: 9999999999,
    aadharNumber: 999999999999,
    panCard: "ADMIN9999A",
    password: "Admin@123",
    AmountPaid: 0,
    TimePeriod: 0,
    BookedRoomNo: 0,
    checkInDate: new Date(),
    Active: true,
    adminApproval: true,
    isAdmin: true
};

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to MongoDB");
        
        // Check if admin already exists
        const existingAdmin = await register.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        // Create new admin user
        const admin = new register(adminUser);
        await admin.save();
        console.log("Admin user created successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    }); 