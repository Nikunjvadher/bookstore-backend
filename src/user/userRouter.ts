import express from "express";
import { createUser, loginUser, getUserProfile } from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();



userRouter.post('/register', createUser);
userRouter.post('/login', loginUser)
userRouter.get('/profile', authenticate, getUserProfile)



export default userRouter;
