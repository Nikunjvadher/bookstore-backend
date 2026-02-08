import express from "express";
import { createUser } from "./userController.js";

const userRouter = express.Router();



userRouter.post('/', (req, res) => {
    res.json({ message: "User Registered" })
})




export default userRouter;
