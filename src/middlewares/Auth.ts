import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { JwtPayload } from '../common/interfaces/IJwt.js';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Acess limited to admins' });
    }
    next();
};