import mongoose from 'mongoose';
import { boolean } from 'webidl-conversions';

const userSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role:{
    type:String,
    required:true,
    enum:["User"],
    default:"User"
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
