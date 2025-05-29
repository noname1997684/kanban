import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (userId: string, res: Response): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign(
        { id: userId },
        jwtSecret,
        { expiresIn: '15d' }
    );

    res.cookie('Usertoken', token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: 'strict',
    })
    return token;
}
