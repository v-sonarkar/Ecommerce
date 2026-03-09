import Product from "../models/productmodel.js";
import { v2 as cloudinary } from "cloudinary";

// Add a new product

const addProduct = async (req, res) => {
  try {
    console.log('=== Add Product Request ===');
    console.log('Body:', req.body);
    console.log('Files:', Object.keys(req.files || {}));
    
    const {
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      bestseller,
    } = req.body;
    // Handle file uploads
    const image1 = req.files.image1 && req.files.image1[0].path;
    const image2 = req.files.image2 && req.files.image2[0].path;
    const image3 = req.files.image3 && req.files.image3[0].path;
    const image4 = req.files.image4 && req.files.image4[0].path;
    const image5 = req.files.image5 && req.files.image5[0].path;

    const images = [image1, image2, image3, image4, image5].filter(
      (item) => item !== undefined
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      image: imagesUrl,
      // Support both subCategory (frontend) and subcategory (backend)
      subcategory: req.body.subCategory || req.body.subcategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    console.log('Product saved successfully:', newProduct._id);
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.json({ success: false, message: error.message || "Failed to add product" });
  }
};

//get all products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ success: false, message: "Failed to fetch products" });
  }
};

//remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.json({ success: false, message: "Failed to remove product" });
  }
};

//get single product
const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.json({ success: false, message: "Failed to fetch product" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
