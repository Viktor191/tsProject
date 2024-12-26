import { Router, Request, Response } from 'express';
import { SomeData } from '../models/models';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authenticateToken';

const router = Router();

// Create: POST (Добавление новой записи)
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

// Read: GET (Получение всех данных)
// @ts-ignore
router.get('/all', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const allData = await SomeData.find();
        res.status(200).json(allData);
    } catch (error: any) {
        console.error('Ошибка при получении данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Read: GET (Получение данных по ID)
// @ts-ignore
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const data = await SomeData.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Данные не найдены' });
        }

        res.status(200).json(data);
    } catch (error: any) {
        console.error('Ошибка при получении данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Update: PUT (Обновление данных)
// @ts-ignore
router.put('/update/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        if (!name && !age) {
            return res.status(400).json({ error: 'Не указаны данные для обновления' });
        }

        const updatedData = await SomeData.findByIdAndUpdate(
            id,
            { name, age },
            { new: true } // Возвращает обновлённый документ
        );

        if (!updatedData) {
            return res.status(404).json({ error: 'Данные не найдены для обновления' });
        }

        res.status(200).json({ message: 'Данные обновлены', data: updatedData });
    } catch (error: any) {
        console.error('Ошибка при обновлении данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Delete: DELETE (Удаление данных)
// @ts-ignore
router.delete('/delete/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await SomeData.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ error: 'Данные не найдены для удаления' });
        }

        res.status(200).json({ message: 'Данные удалены', data: deletedData });
    } catch (error: any) {
        console.error('Ошибка при удалении данных:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;