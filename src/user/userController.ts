import { type Request, type NextFunction, type Response } from "express"
import createHttpError from "http-errors";
import userModal from "./userModal";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import config from "../config/config";
import { User } from "./userTypes";




const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    let token;
    let newUser: User;

    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }


    //db call

    try {
        const user = await userModal.findOne({ email });
        if (user) {
            const error = createHttpError(400, "User already exists");
            return next(error);
        }
    } catch (err) {
        return next(createHttpError(500, "Error WHile getting User"))
    }


    const hasPassword = await bcrypt.hash(password, 10);
    try {

        newUser = await userModal.create({
            name,
            email,
            password: hasPassword
        });

    } catch (err) {
        return next(createHttpError(500, "Error WHile creating User"))
    }

    try {
        token = sign({ sub: newUser._id }, config.JWT_SECRET as string, {
            expiresIn: '1h',
            // algorithm: 'HS256'
        })

    } catch (err) {
        return next(createHttpError(500, "Error WHile creating Token"))
    }
    res.status(201).json({ id: newUser._id, accessToken: token })
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    if (!email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    const user = await userModal.findOne({ email });
    if (!user) {
        const error = createHttpError(404, "User not found");
        return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(createHttpError(401, "Invalid Credentials"));
    }

    try {
        const token = sign({ sub: user._id }, config.JWT_SECRET as string, {
            expiresIn: '7d',
            // algorithm: 'HS256'
        })
        res.json({ accesToken: token })

    } catch (err) {
        return next(createHttpError(500, "Error WHile creating Token"));
    }

}


export { createUser, loginUser };