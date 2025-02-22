import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './database.js';
import drugRoutes from "./routes/drugRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/drugs', drugRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))