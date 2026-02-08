import app from "./src/app";
import config from "./src/config/config";
import connectDB from "./src/config/db";

const port = config.PORT;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
startServer();

export default startServer;