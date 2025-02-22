import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {dbName: process.env.DBNAME});
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection error', err);
        process.exit(1)
    }
}