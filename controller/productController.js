import productModel from "../models/productModel.js";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
}).single("image"); // Single image upload field

// Function to delete uploaded file if an error occurs
const deleteUploadedFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file:", filePath, err);
    }
  });
};

// Create Product Controller
export const createProductController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).send({ success: false, message: err.message });
    }
     console.log(req.body)
    const { name, price, description, category } = req.body;
    const fileName = req.file ? req.file.filename : "";

    // Validation for required fields
    if (!name || !price || !description || !category) {
      if (fileName) deleteUploadedFile(path.join(__dirname, "../uploads", fileName));
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    try {
      const product = new productModel({
        name,
        price,
        description,
        category,
        image: fileName,
      });

      await product.save();
      return res.status(201).send({ success: true, product });
    } catch (error) {
      if (fileName) deleteUploadedFile(path.join(__dirname, "../uploads", fileName));
      console.error("Error saving product:", error);
      return res.status(500).send({ success: false, message: error.message });
    }
  });
};

// Update Product Controller
export const updateProductController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).send({ success: false, message: err.message });
    }

    const { name, price, description, category } = req.body;
    const { pid } = req.params;
    const newFile = req.file ? req.file : null;

    try {
      const product = await productModel.findById(pid);
      if (!product) {
        if (newFile) deleteUploadedFile(path.join(__dirname, "../uploads", newFile.filename));
        return res.status(404).send({ success: false, message: "Product not found" });
      }

      const updatedFields = {
        name: name || product.name,
        price: price || product.price,
        description: description || product.description,
        category: category || product.category,
        image: newFile ? newFile.filename : product.image,
      };

      // Delete old image if a new one is uploaded and different
      if (newFile && product.image && product.image !== newFile.filename) {
        const oldImagePath = path.join(__dirname, "../uploads", product.image);
        deleteUploadedFile(oldImagePath);
      }

      const updatedProduct = await productModel.findByIdAndUpdate(pid, updatedFields, { new: true });

      if (!updatedProduct) {
        if (newFile) deleteUploadedFile(path.join(__dirname, "../uploads", newFile.filename));
        return res.status(400).send({ success: false, message: "Failed to update product" });
      }

      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      if (newFile) deleteUploadedFile(path.join(__dirname, "../uploads", newFile.filename));
      console.error("Error updating product:", error);
      return res.status(500).send({ success: false, message: error.message });
    }
  });
};

// Delete Product Controller
export const deleteProductController = async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }

    await productModel.findByIdAndDelete(pid);

    return res.status(202).send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Get All Products Controller
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (!products || products.length === 0) {
      return res.status(404).send({ success: false, message: "No products found" });
    }

    return res.status(200).send({ success: true,message:"All product fetched successsfully", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
