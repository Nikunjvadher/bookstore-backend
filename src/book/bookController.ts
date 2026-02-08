import { type NextFunction , type Request , type Response } from "express";


const createBook = (req: Request, res:Response , next: NextFunction) => {
    res.json({Message : "Book Created"})
};

export  {createBook};