import { NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from '../mongoose/User';

interface JWTContent {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export const signJWT = (payload: JWTContent) => {
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) throw Error('MISSING JWT SECRET');

    return JWT.sign(JSON.stringify(payload), secret);
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) throw Error('MISSING JWT SECRET');

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).send();
        return;
    }

    const [tokenType, bearerToken] = authHeader.split(' ');

    if (tokenType != 'Bearer' || !bearerToken) {
        res.status(401).send();
        return;
    }

    let decodedToken: JWTContent | null = null;
    try {
        decodedToken = JWT.verify(bearerToken, secret) as JWTContent;
    } catch(e) {
        console.log('catch', e, secret);
        res.status(401).send();
        return;
    }

    if (!decodedToken) {
        res.status(401).send();
        return;
    }

    const user = await UserModel.findById(decodedToken.userId);

    if (user == null) {
        res.status(401).send();
        return;
    }

    req.user = user;
    next();
};

