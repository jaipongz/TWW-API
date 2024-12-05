import { Request, Response } from 'express';
const novelService = require('../services/novelService');
const userService = require('../services/userService');
const fs = require('fs').promises;
export class novelController {

    public static async createNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const { novelName, penName, group, type, mainGroup, subGroup1, subGroup2, tag, rate, desc, status } = req.body;
            const novel_propic = req.file;
            const response = await novelService.createNovel(novelName, penName, group, type, mainGroup, subGroup1,
                subGroup2, tag, rate, desc, novel_propic, userId, status);
            return res.status(200).json({ status: 'success', data: response, message: 'Create novel successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: e });
        }
    }

    public static async getNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        try {
            const { keyword, start, limit } = req.query;
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
            const { start, limit } = req.query;
            const response = await novelService.getNovelDetail(novelId, start, limit);
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
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const novelId = req.params.novelId;
            const { novelName, penName, group, type, mainGroup, subGroup1, subGroup2, tag, rate, desc } = req.body;
            const novel_propic = req.file;
            const updatedNovel = await novelService.updateNovel(
                novelId, novelName, penName, group, type, mainGroup, subGroup1, subGroup2, tag, rate, desc, novel_propic, userId
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
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const novelId = req.params.novelId;
            const updatedNovel = await novelService.destroyNovel(novelId, userId);
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
            const novelId = req.params.novelId;
            const {  chapterName, content ,writerMsg,comment} = req.body;
            const response = await novelService.createDescChapter(novelId, chapterName, content,writerMsg,comment);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async getAllDescChapter(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const novelId = req.query.novelId;
            const startIndex = req.query.startIndex;
            const limitIndex = req.query.limitIndex;
            const response = await novelService.getAllDescChapter(novelId,startIndex,limitIndex);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async getDescChapter(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const chapterId = req.params.chapterId;
    
            if (!chapterId) {
                return res.status(400).json({ 
                    status: 'fail', 
                    message: 'Chapter ID is required.' 
                });
            }
    
            const response = await novelService.getDescChapter(chapterId);
    
            if (!response || response.length === 0) {
                return res.status(404).json({ 
                    status: 'fail', 
                    message: 'Chapter not found.' 
                });
            }
    
            return res.status(200).json({ 
                status: 'success', 
                data: response[0] // Assuming response is an array with one row
            });
        } catch (error) {
            console.error("Error fetching chapter:", error);
    
            return res.status(500).json({ 
                status: 'fail', 
                message: 'An unexpected error occurred while fetching the chapter.' 
            });
        }
    }
    

    public static async createChat(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novelId, chapterName } = req.query;
            const response = await novelService.createChatChapter(novelId, chapterName);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async message(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { chapterId, sender, content, timestamp } = req.query;
            const response = await novelService.createMessage(chapterId, sender, content, timestamp);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async updateMessage(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { messageId } = req.params;
            const { sender, content, timestamp } = req.query;
            const response = await novelService.updateMessage(messageId, sender, content, timestamp);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async deleteMessage(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { messageId } = req.params;
            const response = await novelService.deleteMessage(messageId);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async media(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { chapterId } = req.body;
            const { sender } = req.body;
            const { timestamp } = req.body;
            const media = req.file;
            const response = await novelService.addMedia(chapterId, sender, media, timestamp);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async saveMessage(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { chapterId } = req.params;
            const response = await novelService.saveDraftToMainMessage(chapterId);
            return res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error("Error fetching novels:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async createChar(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novel_id, name, role } = req.body;
            const charPic = req.file;
            const response = await novelService.createChar(novel_id, name, role, charPic);
            return res.status(200).json({ status: 'success', data: response, message: 'Create charactor successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: e });
        }
    }

    public static async updateChar(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const charId = req.params.charId;
            const { name, role } = req.body;
            const charPic = req.file;

            const response = await novelService.updateChar(charId, name, role, charPic);

            if (response.affectedRows > 0) {
                return res.status(200).json({ status: 'success', message: 'Character updated successfully' });
            } else {
                return res.status(404).json({ status: 'fail', message: 'Character not found' });
            }
        } catch (error) {
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async deleteChar(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const charId = req.params.charId;
            const response = await novelService.deleteChar(charId);
            if (response.affectedRows > 0) {
                return res.status(200).json({ status: 'success', message: 'Character deleted successfully' });
            } else {
                return res.status(404).json({ status: 'fail', message: 'Character not found' });
            }
        } catch (error) {
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async getCharById(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const charId = req.params.charId;
            const character = await novelService.getCharById(charId);

            if (character) {
                return res.status(200).json({ status: 'success', data: character });
            } else {
                return res.status(404).json({ status: 'fail', message: 'Character not found' });
            }
        } catch (error) {
            console.error("Error fetching character by ID:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async getAllChar(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const novelId = req.params.novelId;
            const character = await novelService.getAllChar(novelId);

            if (character) {
                return res.status(200).json({ status: 'success', data: character });
            } else {
                return res.status(404).json({ status: 'fail', message: 'Character not found' });
            }
        } catch (error) {
            console.error("Error fetching character by ID:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
    public static async myNovelList(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const { keyword, start, limit, sortBy, where } = req.query;
            const response = await novelService.getMyNovels(keyword, start, limit, userId, sortBy, where);
            return res.status(200).json({ status: 'success', data: response });

        } catch (error) {
            console.error("Error fetching character by ID:", error);
            return res.status(500).json({ status: 'fail', message: error });
        }
    }
}