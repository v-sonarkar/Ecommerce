import express from 'express';
import { loginUser,adminLogin,registerUser } from '../controllers/usercontroller.js';


const userRouter = express.Router();

// User login route
userRouter.post('/login', loginUser);
// User registration route
userRouter.post('/register', registerUser);
// Admin login route
userRouter.post('/admin', adminLogin);



export default userRouter;