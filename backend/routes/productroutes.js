import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/productcontrollers.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/auth.js";

const productRouter = express.Router();

// Add product route
productRouter.post(
  "/add",adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  addProduct
);
// List all products route (public for customers)
productRouter.get("/list", listProducts);
// List all products route (admin with auth)
productRouter.post("/list",adminAuth, listProducts);
// Remove product route
productRouter.post("/remove/:id",adminAuth, removeProduct);
// Get single product route (public for customers)
productRouter.get("/single/:id", singleProduct);

export default productRouter;
