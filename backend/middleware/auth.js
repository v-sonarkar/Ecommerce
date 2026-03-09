import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "No auth token,access denied",
      });
    }
    // Verify the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // The token should contain admin identifier that we can verify
    if (token_decode.type !== 'admin' || 
        token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Token verification failed,access denied",
      });
    }
    
    // Optional: Check if token is expired (e.g., 24 hours)
    const tokenAge = Date.now() - token_decode.timestamp;
    if (tokenAge > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      return res.json({
        success: false,
        message: "Token has expired, please login again",
      });
    }
    next();
  } catch (error) {
    console.error("Error in admin authentication middleware:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export default adminAuth;
