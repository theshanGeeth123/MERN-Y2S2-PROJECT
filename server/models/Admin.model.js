import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    admin_id:{
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        required: true, 
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }


});

const Admin = mongoose.model("AdminModel", adminSchema);

export default Admin;