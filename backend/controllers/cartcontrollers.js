//add products to user cart
import user from "../models/usermodels.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    //fetch user cart from db using userId
    const userData = await user.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = userData.cartData || {}; // ensure object

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    await user.findByIdAndUpdate(userId, { cartData: cartData });

    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update product quantity in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    //fetch user cart from db using userId
    const userData = await user.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    let cartData = userData.cartData || {}; // ensure object
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = quantity; //update quantity
    await user.findByIdAndUpdate(userId, { cartData: cartData });

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get user cart details
const getuserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    //fetch user cart from db using userId
    const userData = await user.findById(userId);
    let cartData = userData?.cartData || {}; // ensure object
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getuserCart };
