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

// Middleware
app.use(express.json());

// Подключение к MongoDB
mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Ошибка подключения к MongoDB:', err.message);
        process.exit(1);
    });

// Роуты
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
