import { Request, Response } from 'express';
const novelService = require('../services/novelService');

export class novelController {

    public static async createNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novelName, penName, group, type, tag, rate, desc,userId } = req.body;
            const novel_propic = req.file;
            const response = await novelService.createNovel(novelName, penName, group, type, tag, rate, desc, novel_propic,userId);
            return res.status(200).json({ status: 'success',data: response, message: 'Create novel successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: e });
        }
    }

    public static async getNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        try {
            const { keyword, start , limit} = req.query;
            const response = await novelService.getNovels(keyword, start, limit);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async getNovelDetail(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        try {
            const novelId = req.params.novelId;
            const {start,limit} = req.query;
            const response = await novelService.getNovelDetail(novelId,start,limit);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async updateNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const novelId = req.params.novelId;
            const { novelName, penName, group, type, tag, rate, desc, userId } = req.body;
            const novel_propic = req.file;
            const updatedNovel = await novelService.updateNovel(
                novelId, novelName, penName, group, type, tag, rate, desc, novel_propic, userId
            );
            return res.status(200).json({ status: 'success', data: updatedNovel, message: 'Novel updated successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: e });
        }
    }
    
    public static async destroyNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const novelId = req.params.novelId;
            const updatedNovel = await novelService.destroyNovel(novelId);
            return res.status(200).json({ status: 'success', data: updatedNovel, message: 'Novel updated successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: e });
        }
    }

    public static async createDescChapter(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const {novelId,chapterName,content} = req.query;
            const response = await novelService.createDescChapter(novelId,chapterName,content);
            return res.status(200).json({ status: 'success', data: 'response' });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    
}