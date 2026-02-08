import { config as Conf } from "dotenv";
Conf();


const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_CONNECTION_URL,
    ENV: process.env,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;