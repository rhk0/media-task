import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String,
    required: true,
    enum: ['image', 'video'], // Add media types (image/video)
  },
  uploadDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
