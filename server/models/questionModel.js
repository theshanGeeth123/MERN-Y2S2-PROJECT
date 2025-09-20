import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  question:{type:String,required:true},
  status:{type:String,required:true},
  answer:{type:String}
}, { timestamps: true });

const questionModel = mongoose.model.question ||  mongoose.model('question', questionSchema);

export default questionModel;

