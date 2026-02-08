import { type Request, type NextFunction, type Response } from "express"
import createHttpError from "http-errors";
import userModal from "./userModal";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }


    //db call
    const user = await userModal.findOne({ email });
    if (user) {
        const error = createHttpError(400, "User already exists");
        return next(error);
    }




    res.json({ message: "User Registered" })
}

export { createUser };