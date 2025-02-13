import express from "express";
import { isRequiredSignIn, isUser } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import { uploadMedia, getMedia, deleteMedia } from "../controller/mediaController.js";

const router = express.Router();

router.post("/upload", isRequiredSignIn,isUser, uploadMiddleware.single("file"), uploadMedia);
router.get("/media", isRequiredSignIn,isUser, getMedia);
router.delete("/media/:id", isRequiredSignIn,isUser, deleteMedia);

export default router;
