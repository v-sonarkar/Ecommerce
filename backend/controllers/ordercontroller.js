// Placing and managing orders
import Order from "../models/ordermodel.js";
import user from "../models/usermodels.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

//Global variables
const currency = "inr";
const delivery_Charges = 10;

//gateway instances
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Log Stripe initialization
console.log("[Stripe] Initialized with key:", process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 15)}...` : 'MISSING');
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("[Stripe] WARNING: STRIPE_SECRET_KEY not found in environment variables!");
}

const placeOrder = async (req, res) => {
  try {
    // userId is injected by userAuth middleware from token
    const { userId, items, amount, address, paymentMethod = "cod" } = req.body;

    if (!userId)
      return res.json({ success: false, message: "No userId provided" });
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "No items provided" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: paymentMethod === "cod" ? false : true,
      status: "Order Placed",
      date: Date.now(),
    };

    const order = new Order(orderData);
    await order.save();

    // clear user cart after order placement
    await user.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Place Order using Stripe method
const placeOrderStripe = async (req, res) => {
  console.log("[Stripe] ===== STRIPE PAYMENT HANDLER CALLED =====");
  try {
    const { userId, items, amount, address } = req.body;
    // Fallback to referer or localhost if origin is not set
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:5173';
    
    console.log("[Stripe] Creating checkout session");
    console.log("  userId:", userId);
    console.log("  items count:", items?.length);
    console.log("  amount:", amount);
    console.log("  origin:", origin);

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "stripe",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const order = new Order(orderData);
    await order.save();
    console.log("  order saved:", order._id);

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(delivery_Charges * 100),
      },
      quantity: 1,
    });

    console.log("  line_items:", JSON.stringify(line_items, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
    });
    
    console.log("  session created:", session.id);
    console.log("  session_url:", session.url);
    
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("[Stripe] Error:", error.message);
    console.error("[Stripe] Stack:", error.stack);
    res.json({ success: false, message: error.message });
  }
};
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await user.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Place Order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "razorpay",
      payment: true,
      status: "Order Placed",
      date: Date.now(),
    };
    const order = new Order(orderData);
    await order.save();
    await user.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All orders for admin
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.json({ success: false, message: "No userId provided" });
    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update order status by admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (_req, _res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};
