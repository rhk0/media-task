import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantityInCart } from "../controller/cartController.js";
import { isRequiredSignIn,isUser } from "../middlewares/authMiddleware.js";
import { updateProductController } from "../controller/productController.js";
const router = express.Router();

// Route to add a product to the cart
router.post("/add", isRequiredSignIn,isUser, addToCart);

// Route to remove a product from the cart
router.post("/remove/:productId",isRequiredSignIn,isUser,  removeFromCart);

// Route to get the user's cart
router.get("/get",isRequiredSignIn,isUser, getCart);
router.put("/update/:id",isRequiredSignIn,isUser,updateQuantityInCart)

export default router;
