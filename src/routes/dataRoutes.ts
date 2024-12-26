import { Router, Request, Response } from 'express';
import { SomeData } from '../models/models';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authenticateToken';

const router = Router();
// @ts-ignore
router.post('/add', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, age } = req.body;

        if (!name || !age) {
            return res.status(400).json({ error: 'Имя и возраст обязательны' });
        }

        const newData = new SomeData({ name, age });
        await newData.save();

        res.status(201).json({ message: 'Данные добавлены', id: newData._id });
    } catch (error: any) {
        console.error('Ошибка при добавлении данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;