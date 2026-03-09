import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
} from "../controllers/ordercontroller.js";
import adminAuth from "../middleware/auth.js";
import userAuth from "../middleware/userauth.js";

const orderRouter = express.Router();
// Basic logger for order routes
orderRouter.use((req, _res, next) => {
  console.log(`[order] ${req.method} ${req.path}`);
  next();
});
// Health check for troubleshooting
orderRouter.get("/health", (_req, res) => {
  res.json({ ok: true, message: "order router alive" });
});
// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features(user authenticated)
orderRouter.post("/place", userAuth, placeOrder);
orderRouter.post("/stripe", userAuth, placeOrderStripe);
orderRouter.post("/razorpay", userAuth, placeOrderRazorpay);

// User Feature
orderRouter.post("/userorders", userAuth, userOrders);

// verify payment
orderRouter.post("/verifyStripe", userAuth, verifyStripe);
orderRouter.post("/verifyRazorpay", userAuth, verifyRazorpay);

// Fallback 404 for unmatched order routes (Express 5/path-to-regexp safe)
orderRouter.use((req, res) => {
  res.json({
    success: false,
    message: "Order route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

export default orderRouter;
