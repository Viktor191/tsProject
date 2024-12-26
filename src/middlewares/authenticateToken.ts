import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Расширяем Request, добавляя поле user
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string; // Указываем корректный тип
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Нет токена' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user) {
            res.status(403).json({ error: 'Неверный или истёкший токен' });
            return;
        }

        if (typeof user === 'object') {
            (req as AuthenticatedRequest).user = user as JwtPayload;
            next();
        } else {
            res.status(403).json({ error: 'Неверный формат токена' });
        }
    });
};