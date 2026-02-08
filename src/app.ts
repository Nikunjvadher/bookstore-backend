import express, { type Request, type Response, type NextFunction } from "express";
import config from "./config/config.js";
import type { HttpError } from "http-errors";
import createHttpError from "http-errors";

const app = express();
const port = config.PORT;

app.get('/', (req: Request, res: Response) => {
    const error = createHttpError(404, 'Something went wrong');
    throw error;
});


app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode;

    return res.json(statusCode).json({
        message: err.message,
        stack: config.env === "development" ? err.stack : '',
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


export default app;