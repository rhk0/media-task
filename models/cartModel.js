import mongoose from "mongoose";

// Cart Model
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This references the User model
      required: true,
    },
    products: [ 
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Assuming you have a Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create the Cart model
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

