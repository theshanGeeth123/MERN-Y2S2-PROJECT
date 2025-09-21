import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    category:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required:true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    }

});

const Rental = mongoose.model('rentalItems', rentalSchema)

export default Rental