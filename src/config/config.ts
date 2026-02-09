import { config as Conf } from "dotenv";
Conf();


const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_CONNECTION_URL,
    ENV: process.env,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
}

export default config;