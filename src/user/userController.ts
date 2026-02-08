import { type Request, type NextFunction, type Response } from "express"
import createHttpError from "http-errors";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    res.json({ message: "User Registered" })
}

export { createUser };