import { Request, Response } from 'express';
const novelService = require('../services/novelService');

export class novelController {

    public static async createNovel(req: Request, res: Response) {
        // #swagger.tags = ['Member']
        try {
            const { novelName, penName, group, type, tag, rate, desc,userId } = req.body;
            const novel_propic = req.file;
            console.log(novel_propic);

            const response = await novelService.createNovel(novelName, penName, group, type, tag, rate, desc, novel_propic,userId);


            return res.status(200).json({ status: 'success',data: response, message: 'Logged out successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: 'Logout failed' });
        }
    }
}