import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        })


        mongoose.connection.on('error', () => {
            console.log('Error connecting to MongoDB');
        })
        await mongoose.connect(config.DB_URL as string);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

export default connectDB;