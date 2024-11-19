import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: string | JwtPayload;
    }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET + "") as jwt.JwtPayload;
        req.user = verified as JwtPayload;;
        console.log('USER IS');
        console.log(req.user);
        
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};


export { verifyToken};

