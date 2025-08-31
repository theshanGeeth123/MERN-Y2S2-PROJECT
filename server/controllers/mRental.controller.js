import mongoose from "mongoose";
import Rental from "../models/mRental.model.js";

export const getRentItems = async (req,res)=>{
    try {
        const viewRental = await Rental.find({});
        res.status(200).json({ 
            success: true, 
            data:viewRental
        })
    } catch (error) {
        console.log("error in fetching Items:", error.message);
        res.status(500).json({
            success: false, 
            message:"Server error"
        });
    }
}

export const postRentItems = async (req, res) => {
    const rental = req.body;

    if (!rental.name || !rental.category || !rental.price || !rental.description || !rental.image) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newRental = new Rental(rental);

    try {
        await newRental.save();
        res.status(201).json({ 
            success: true, 
            data: newRental 
        });
    } catch (error) {
        console.error("Error in create Rental Item:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
}


export const updateRentItems = async(req,res)=>{
    const {id} = req.params;
    const rental = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"Invalid Item ID"});
    }

    try {
        const updID = await Rental.findByIdAndUpdate(req.params.id);
        if (!updID) {
            return res.status(404).json({ success: false, message: "Rental Item not found" });
        }
        
        const updateRental = await Rental.findByIdAndUpdate(id,rental,{new:true});
        
        res.status(200).json({
            success:true, 
            message: "Update Successful", 
            data:updateRental
        });
    } catch (error) {
        res.status(500).json({
            success:false, 
            message:"Server error."
        })
    }
}


export const deleteRentItems = async (req, res) => {
    try {
        const deleteRental = await Rental.findByIdAndDelete(req.params.id);

        if (!deleteRental) {
            return res.status(404).json({ success: false, message: "Rental Item not found" });
        }

        res.status(200).json({
            success: true,
            message: "Delete successful",
            data: deleteRental
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error while deleting rental item",
            error: err.message
        });
    }
}

/*
router.delete("/:id", async (req,res)=>{
    const {id} = req.params;
    
    try {
        await Rental.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Item was Deleted..."});
    } catch (error) {
        res.status(404).json({success: false, message: "Product not found"});
    }
});

*/


/* name:{
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
    } */
