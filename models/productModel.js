import mongoose from 'mongoose';

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    image: {
      type: String,  // Store the file path of the image
      required: true
    }
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create the Product model
export default mongoose.model('Product', productSchema);


