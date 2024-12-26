import { Router, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/models';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


router.post(
    '/register',// @ts-ignore
    async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Введите логин и пароль' });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
            }

            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: 'Пользователь зарегистрирован' });
        } catch (error: any) {
            console.error('Ошибка регистрации:', error.message);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);

router.post(
    '/login',// @ts-ignore
    async (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
            }

            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                JWT_SECRET,
                { expiresIn: '10h' }
            );

            res.status(200).json({ message: 'Успешная авторизация', token });
        } catch (error: any) {
            console.error('Ошибка авторизации:', error.message);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);

export default router;