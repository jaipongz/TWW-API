import { Request, Response } from 'express';
const CommonService = require('../services/commonService');

// 

export class commonController {
    public static async postComment(req: Request, res: Response) {
        const { novelId, chapterId, userId, content } = req.body;
        const result = await CommonService(CommonService.postComment, res, novelId, chapterId, userId, content);
        if (result) {
            res.status(201).json({ status: 'success', message: "Comment added successfully", commentId: result.insertId });
        }
    }

    public static async deleteComment(req: Request, res: Response) {
        const { commentId } = req.params;
        const result = await CommonService(CommonService.deleteComment, res, commentId);
        if (result && result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: "Comment not found" });
        }
        res.status(200).json({ status: 'success', message: "Comment deleted successfully" });
    }

    public static async getCommentsByNovel(req: Request, res: Response) {
        const { novelId } = req.params;
        const response = await CommonService(CommonService.getCommentsByNovel, res, novelId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async getCommentsByChapter(req: Request, res: Response) {
        const { chapterId } = req.params;
        const response = await CommonService(CommonService.getCommentsByChapter, res, chapterId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async addLike(req: Request, res: Response) {
        const { novelId, chapterId, userId } = req.body;
        const result = await CommonService(CommonService.addLike, res, novelId, chapterId, userId);
        if (result) {
            res.status(201).json({ status: 'success', message: "Liked successfully" });
        }
    }

    public static async removeLike(req: Request, res: Response) {
        const { novelId, chapterId, userId } = req.body;
        const result = await CommonService(CommonService.removeLike, res, novelId, chapterId, userId);
        if (result && result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: "Like not found" });
        }
        res.status(200).json({ status: 'success', message: "Unliked successfully" });
    }

    public static async getLikeCountByNovel(req: Request, res: Response) {
        const { novelId } = req.params;
        const response = await CommonService(CommonService.getLikeCountByNovel, res, novelId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async getLikeCountByChapter(req: Request, res: Response) {
        const { chapterId } = req.params;
        const response = await CommonService(CommonService.getLikeCountByChapter, res, chapterId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async shareNovelOrChapter(req: Request, res: Response) {
        const { novelId, chapterId, userId } = req.body;
        const result = await CommonService(CommonService.shareNovelOrChapter, res, novelId, chapterId, userId);
        if (result) {
            res.status(201).json({ status: 'success', message: "Shared successfully" });
        }
    }

    public static async getShareCountByNovel(req: Request, res: Response) {
        const { novelId } = req.params;
        const response = await CommonService(CommonService.getShareCountByNovel, res, novelId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async getShareCountByChapter(req: Request, res: Response) {
        const { chapterId } = req.params;
        const response = await CommonService(CommonService.getShareCountByChapter, res, chapterId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }
}
