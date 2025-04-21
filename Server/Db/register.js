const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already registered"]
    },
    mobile:{
        type:String,
        required:true,
        unique:[true,"Number already registered"]
    },
    aadharNumber:{
        type:String,
        required:true,
        unique:[true,"Account already exists with same Aadhar Number"],
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhar number!`
        }
    },
    panCard:{
        type:String, 
        unique:[true,"Account already exists with same PAN Card"]
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"password should contain at least 8 characters"]
    },
    AmountPaid:{
        type:Number,
        default: 0
    },
    TimePeriod:{
        type:Number,
        default: 0
    },
    BookedRoomNo:{
        type:Number,
        default: 0
    },
    checkInDate:{
        type:Date,
        default: Date.now
    },
    Active:{
        type:Boolean,
        default: true
    },
    adminApproval:{
        type:Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const register=new mongoose.model('register',userSchema);

module.exports=register;