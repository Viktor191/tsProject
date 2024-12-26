import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error('MONGO_URI не задан в .env');
}

app.use(express.json());

mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Ошибка подключения к MongoDB:', err.message);
        process.exit(1);
    });

app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
