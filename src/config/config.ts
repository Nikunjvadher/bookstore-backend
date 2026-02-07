import { config as Conf } from "dotenv";
Conf();


const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_CONNECTION_URL
}

export default config;