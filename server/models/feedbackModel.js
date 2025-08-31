import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  selectedPhotographer:{type:String,required:true},
  rate:{type:String,required:true},
  comment:{type:String,required:true}
});

const feedbackModel = mongoose.model.feedback ||  mongoose.model('feedback',feedbackSchema);

export default feedbackModel;

