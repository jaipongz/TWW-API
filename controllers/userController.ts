import { Request, Response } from 'express';
const userService = require('../services/userService');
export class userController {
    public static async register(req: Request, res: Response) {
        // #swagger.tags = ['User']
        try {
            const { username, email, password } = req.body;
            const newUser = await userService.register(username, email, password);
            res.status(201).json({ status: 'success', data: newUser });
        } catch (e) {
            res.status(500).json({ status: 'fail', message: e });
        }
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        // #swagger.tags = ['User']
        try {
            const { username, password } = req.body;
            const user = await userService.login(username, password);

            if (!user) {
                return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
            }
            return res.status(200).json({ status: 'success', data: user });
        } catch (e) {
            if (e instanceof Error) {
                return res.status(401).json({ status: 'fail', message: e.message });
            }
            return res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
        }
    }

    public static async logout(req: Request, res: Response): Promise<Response> {
        // #swagger.tags = ['User']
        try {
            res.clearCookie('token');
            return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: 'Logout failed' });
        }
    }

    public static async test(req: Request, res: Response) {
        /* #swagger.security = [{
            "Bearer": []
        }] */
        
        // This endpoint is protected by the authMiddleware
        res.status(200).json({ status: 'success', message: 'Authenticated!!!' });
    }
}
