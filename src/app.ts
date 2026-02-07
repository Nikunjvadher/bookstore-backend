import express from "express";
import config from "./config/config.js";

const app = express();
const port = config.PORT;


app.get("/", (req, res , next) => {
    res.send("Hello World!");
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


export default app;