import Package from "../models/packageModel.js";
import mongoose from "mongoose";

export const getPackages = async (req,res) => {
    try {
        const packages = await Package.find({});
        res.status(200).json({ success:true, data: packages });
    } catch (error) {
       console.log("Error in fetching packages:", error.message);
       res.status(500).json({ success:false, message: "Server Error"});
    }
} 

export const getPackageById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Package ID" });
  }

  try {
    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    console.error("Error fetching package:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const createPackage = async (req,res) => {
    const packages = req.body;

    if(!packages.title || !packages.description || !packages.price || !packages.duration || !packages.features ) {
        return res.status(400).json({ success:false, message: "Please provide all fields" });
    }

    const newPackage = new Package(packages)

    try{
        await newPackage.save();
        res.status(201).json({ success:true, data: newPackage});
    } catch (error) {
        console.error("Error in create package:", error.message);
        res.status(500).json({ success:false, message: "Server Error"});
    }
}


export const updatePackage = async (req,res) => {
    const {id} = req.params; 

    const packages = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success:false, message:"Invalid Package ID"});
    }

    try {
      const updatedPackage = await Package.findByIdAndUpdate(id, packages, {new:true});
      res.status(200).json({ success:true, data: updatedPackage });
    } catch (error) {
      res.status(500).json({ success:false, message: "Server Error"});
    }
}


export const deletePackage = async (req,res) => {
    const {id} = req.params;
   
    try {
      await Package.findByIdAndDelete(id);
      res.status(200).json({ success:true, message: "Product Deleted"});
    } catch (error) {
        console.log("Error in deleting package:", error.message);
      res.status(404).json({ success:false, message: "Product not found"});
    }
}