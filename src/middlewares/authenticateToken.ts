// authenticateToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Расширяем стандартный JwtPayload, добавляя нужные поля
export interface MyTokenPayload extends JwtPayload {
    userId: string;
    username: string;
}

// Расширяем Request, добавляя поле user
export interface AuthenticatedRequest extends Request {
    // Если хотите также обрабатывать случай, когда decoded может быть строкой:
    // user?: MyTokenPayload | string;
    user?: MyTokenPayload;
}

// Middleware для проверки JWT-токена
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

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(403).json({ error: 'Неверный или истёкший токен' });
            return;
        }

        // Если decoded — объект, приводим к MyTokenPayload и записываем в req.user
        if (typeof decoded === 'object') {
            req.user = decoded as MyTokenPayload;
            next();
        } else {
            // Если почему-то jwt вернул строку, даём ошибку
            // (или можете записать в req.user как строку, если это ваш сценарий)
            res.status(403).json({ error: 'Неверный формат токена' });
        }
    });
};