import { Request, Response } from 'express';
const novelService = require('../services/novelService');
const fs = require('fs').promises;
export class novelController {

    public static async createNovel(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novelName, penName, group, type,mainGroup,subGroup1,subGroup2, tag, rate, desc,userId } = req.body;
            const novel_propic = req.file;
            const response = await novelService.createNovel(novelName, penName, group, type, mainGroup,subGroup1,
            subGroup2,tag, rate, desc, novel_propic,userId);
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
            const { novelName, penName, group, type,mainGroup,subGroup1,subGroup2, tag, rate, desc, userId } = req.body;
            const novel_propic = req.file;
            const updatedNovel = await novelService.updateNovel(
                novelId, novelName, penName, group, type,mainGroup,subGroup1,subGroup2, tag, rate, desc, novel_propic, userId
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
    
    public static async createChat(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const {novelId,chapterName,order} = req.query;
            const response = await novelService.createChatChapter(novelId,chapterName,order);
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
            const {chapterId ,sender,type,content,timestamp} = req.query;
            const response = await novelService.createMessage(chapterId ,sender,type,content,timestamp);
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
            const {sender,content,timestamp} = req.query;
            const response = await novelService.updateMessage(messageId,sender,content,timestamp);
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
    public static async createChar(req: Request, res: Response) {
        // #swagger.tags = ['Novel']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novel_id, name, role } = req.body;
            const charPic = req.file;
            const response = await novelService.createChar( novel_id, name, role,charPic);
            return res.status(200).json({ status: 'success',data: response, message: 'Create charactor successfully' });
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
          const {  name, role } = req.body;
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
          return res.status(500).json({ status: 'fail', message: error});
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
            return res.status(500).json({ status: 'fail', message: 'Character retrieval failed' });
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
            return res.status(500).json({ status: 'fail', message: 'Character retrieval failed' });
        }
    }
}