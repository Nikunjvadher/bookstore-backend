import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'
import config from "../config/config";

export interface AuthRequest extends Request {
    userId: string;
}


const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('Authorization');
    if (!token) {
        return next(createHttpError('401', 'Unauthorized'));
    }

    try {
        const parsedToken = token.split(' ')[1];
        const decod = jwt.verify(parsedToken as string, config.JWT_SECRET as string);
        const _req = req as AuthRequest;
        _req.userId = decod.sub as string;

    } catch (error) {
        return next(createHttpError('401', 'Unauthorized'));
    }
    // console.log(decod);

    next();
}

export default authenticate;