import jwt from "jsonwebtoken";

//This middleware will convert the user token into user id and attach it to req object
const userAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.warn("[userAuth] No token provided");
    return res.json({ success: false, message: "No token provided" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    console.log("[userAuth] token ok for user:", token_decode.id);
    next();
  } catch (error) {
    console.warn("[userAuth] Invalid token:", error?.message);
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;
