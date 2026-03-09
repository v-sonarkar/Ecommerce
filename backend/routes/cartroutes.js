import express from "express";
import { getuserCart,addToCart,updateCart } from "../controllers/cartcontrollers.js";
import userAuth from "../middleware/userauth.js";




const cartRouter = express.Router();


cartRouter.post('/get',userAuth,getuserCart);
cartRouter.post('/add',userAuth,addToCart);
cartRouter.post('/update',userAuth,updateCart);

export default cartRouter;