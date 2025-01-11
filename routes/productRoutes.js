import express from "express"
import { createProductController, deleteProductController, getAllProductsController, updateProductController } from "../controller/productController.js";
import { isAdmin, isRequiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/add",isRequiredSignIn,isAdmin, createProductController)
router.get("/all",getAllProductsController)
router.put("/update/:pid",isRequiredSignIn,isAdmin,updateProductController)
router.delete("/delete/:pid",isRequiredSignIn,isAdmin,deleteProductController);
export default router;