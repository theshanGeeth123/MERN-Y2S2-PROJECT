import Product from "../models/Products.model.js";

import mongoose from "mongoose";

export const addProduct = async(req,res)=>{

    const product = req.body;

    if(!product.name || !product.description || !product.price ||!product.url){
        
        return res.status(400).json({success:false,message:"Please provide all fields"});

    }

    const newProduct = new Product(product);

    try {
        
        await newProduct.save();
        res.status(201).json({success:true,data:newProduct});

    } catch (error) {
        console.log(`Error in create product ,${error.message}`);
        res.status(500).json({success:false,message:"Server Error"});
    }

};

export const getProducts = async(req,res)=>{

    try {
        const products = await Product.find({});
        res.status(200).json({success:true,data:products});
    } catch (error) {
        console.log("Error in fetching products ",error.message);
        res.status(500).json({success:false,message:"Server Error"});
    }

}

export const updateProduct = async(req,res)=>{

    const {id} = req.params;

    const product = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false,message:"Invalid Product ID"});
    }

    try {
        
        const updatedProduct = await Product.findByIdAndUpdate(id,product,{new:true});

        res.status(200).json({success:true,data:updatedProduct});

    } catch (error) {

         res.status(500).json({success:false,message:"Server Error "});
        
    }

};

export const getDetailsById = async(req,res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false,message:"Invalid Product ID"});
    }

    try {

        const product = await Product.findById(id);

        if(product){

            res.status(200).json({success:true,data:product});

        }
        
    } catch (error) {
        res.status(500).json({success:false,message:"Server Error "});
        
    }

};

export const deleteProduct = async(req,res)=>{

     const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({success:false,message:"Invalid Product ID"});
    }

    try {

        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true});

        
    } catch (error) {
        res.status(500).json({success:false,message:"Server Error "});
        
    }


};