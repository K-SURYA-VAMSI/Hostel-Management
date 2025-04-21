const register = require("../Db/register");
const rooms = require("../Db/Rooms");
const validator = require("validator");

// Helper function to validate password strength
const isStrongPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
};

module.exports.register = async (req, res) => {
    try {
        console.log("Registration attempt:", {
            ...req.body,
            password: '***' // Hide password in logs
        });
        const { name, email, password, mobile, aadarCard, panCard } = req.body;

        // Validate required fields
        if (!name || !email || !password || !mobile || !aadarCard) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (except PAN card which is optional)"
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Validate password strength
        if (!isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character"
            });
        }

        // Validate mobile number
        const mobileStr = mobile.toString().replace(/\D/g, '');
        if (mobileStr.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must be exactly 10 digits"
            });
        }

        // Validate Aadhar card
        const aadharStr = aadarCard.toString().replace(/\D/g, '');
        if (aadharStr.length !== 12) {
            return res.status(400).json({
                success: false,
                message: "Aadhar number must be exactly 12 digits"
            });
        }

        // Check if user already exists
        const existingUser = await register.findOne({
            $or: [
                { email: email },
                { mobile: mobileStr },
                { aadharNumber: aadharStr }
            ]
        });

        if (existingUser) {
            let message = "User already exists with this ";
            if (existingUser.email === email) message += "email address";
            else if (existingUser.mobile === mobileStr) message += "mobile number";
            else if (existingUser.aadharNumber === aadharStr) message += "Aadhar number";

            console.log("Duplicate user found:", {
                attemptedEmail: email,
                existingEmail: existingUser.email,
                attemptedMobile: mobileStr,
                existingMobile: existingUser.mobile,
                attemptedAadhar: aadharStr,
                existingAadhar: existingUser.aadharNumber
            });

            return res.status(409).json({
                success: false,
                message: message
            });
        }

        // Create new user with default values
        const newUser = new register({
            name,
            email,
            password,
            mobile: mobileStr,
            aadharNumber: aadharStr,
            panCard: panCard ? panCard.toUpperCase() : undefined,
            AmountPaid: 0,
            BookedRoomNo: 0,
            Active: true,
            TimePeriod: 0,
            checkInDate: new Date(),
            adminApproval: true,
            isAdmin: false
        });

        const savedUser = await newUser.save();
        console.log("User registered successfully:", {
            email: savedUser.email,
            mobile: savedUser.mobile,
            aadharNumber: savedUser.aadharNumber
        });
        
        return res.status(201).json({
            success: true,
            message: "Registration successful! You can now login.",
            user: {
                name: savedUser.name,
                email: savedUser.email,
                mobile: savedUser.mobile
            }
        });

    } catch (error) {
        console.error("Registration error details:", {
            error: error.message,
            stack: error.stack,
            code: error.code
        });

        // Check for MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const fieldName = {
                email: "email address",
                mobile: "mobile number",
                aadharNumber: "Aadhar number",
                panCard: "PAN card"
            }[field] || field;

            return res.status(409).json({
                success: false,
                message: `This ${fieldName} is already registered`
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
            error: error.message
        });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log the login attempt with full request body
        console.log("Login attempt details:", {
            email,
            passwordLength: password ? password.length : 0,
            body: req.body
        });

        // Validate required fields
        if (!email || !password) {
            console.log("Missing required fields:", { email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            console.log("Invalid email format:", email);
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Find user by email first
        const user = await register.findOne({ email });
        console.log("User lookup result:", {
            found: !!user,
            email: email,
            userEmail: user ? user.email : null
        });
        
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const passwordMatch = user.password === password;
        console.log("Password check:", {
            match: passwordMatch,
            providedLength: password.length,
            storedLength: user.password.length
        });

        if (!passwordMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if user is approved by admin (if needed)
        if (!user.adminApproval) {
            console.log("User not approved by admin:", email);
            return res.status(403).json({
                success: false,
                message: "Account pending admin approval"
            });
        }

        // Successful login
        console.log("User logged in successfully:", email);
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin || false,
                BookedRoomNo: user.BookedRoomNo || 0,
                AmountPaid: user.AmountPaid || 0,
                TimePeriod: user.TimePeriod || 0,
                checkInDate: user.checkInDate,
                Active: user.Active
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login",
            error: error.message
        });
    }
}

module.exports.userDetails = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        console.log("Fetching user details for email:", email);
        const user = await register.findOne({ email });
        
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Log complete user data for debugging
        console.log("Complete user data:", {
            name: user.name,
            email: user.email,
            BookedRoomNo: user.BookedRoomNo,
            AmountPaid: user.AmountPaid,
            TimePeriod: user.TimePeriod,
            checkInDate: user.checkInDate,
            Active: user.Active
        });

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                BookedRoomNo: user.BookedRoomNo,
                AmountPaid: user.AmountPaid,
                TimePeriod: user.TimePeriod,
                checkInDate: user.checkInDate,
                Active: user.Active
            },
            debug: {
                rawBookedRoomNo: user.BookedRoomNo,
                rawTimePeriod: user.TimePeriod,
                rawCheckInDate: user.checkInDate
            }
        });

    } catch (error) {
        console.error("Error in userDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message
        });
    }
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