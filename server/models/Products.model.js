import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  availability:{ 
    type: Boolean, 
    default: true 
  }
});

const Product = mongoose.model("ProductModel", productSchema);

export default Product;
