import express, { type Request, type Response, type NextFunction } from "express";
import createHttpError from "http-errors";
import errorHandling from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// app.get('/', (req: Request, res: Response) => {
//     const error = createHttpError(404, 'Something went wrong');
//     throw error;
// });

// Handle 404 for any other route that is not found
// app.use((req: Request, res: Response, next: NextFunction) => {
//     next(createHttpError(404, "Not Found"));
// });


app.use("/api/user", userRouter);

app.use(errorHandling);
export default app;
