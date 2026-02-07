import { config as Conf } from "dotenv";
Conf();


const config = {
    PORT: process.env.PORT
}

export default config;