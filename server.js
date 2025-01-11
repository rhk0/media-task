import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cartRoute from './routes/cartRoutes.js';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the directory of the current file

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use("/api/v1/uploads", express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoute);

// Serve the React frontend after building
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  // Serve index.html for any other route that doesn't match API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
