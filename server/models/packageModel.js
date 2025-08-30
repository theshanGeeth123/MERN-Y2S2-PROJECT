import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,//validate
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    features:{
        type:String,
        required:true,
    }
});

const Package = mongoose.model("Package",packageSchema)
export default Package;