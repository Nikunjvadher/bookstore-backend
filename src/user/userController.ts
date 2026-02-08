import { type Request, type NextFunction, type Response } from "express"
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import config from "../config/config";




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

    const hasPassword = await bcrypt.hash(password, 10);

    const newUser = await userModal.create({
        name,
        email,
        password: hasPassword
    });

    const token = sign({ sub: newUser._id }, config.JWT_SECRET as string, { expiresIn: '1h'  , 
        // algorithm: 'HS256'
    })




    res.json({ id: newUser._id, accessToken: token })
}

export { createUser };