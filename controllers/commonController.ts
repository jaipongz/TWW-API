import { Request, Response, NextFunction, RequestHandler} from 'express';
const CommonService = require('../services/commonService');


export class commonController {
    public static async postComment(req: Request, res: Response) {
        const { novelId, chapterId, userId, content } = req.body;
        console.log('Oncontroller');
        
        const result = await CommonService.postComment(novelId, chapterId, userId, content);
        if (result) {
            res.status(201).json({ status: 'success', message: "Comment added successfully", commentId: result.insertId });
        }else{
            res.status(500).json({ status: 'fail', message: "Comment added fail", commentId: result.insertId });

        }
    }

    public static deleteComment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { commentId } = req.params;
        try {
            const result = await CommonService.deleteComment(commentId);
            if (result && result.affectedRows === 0) {
                res.status(404).json({ status: 'error', message: "Comment not found" });
                return;
            }
            res.status(200).json({ status: 'success', message: "Comment deleted successfully" });
        } catch (error) {
            next(error);
        }
    };

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

    public static removeLike: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { novelId, chapterId, userId } = req.body;
        try {
            const result = await CommonService.removeLike(novelId, chapterId, userId);
            if (result && result.affectedRows === 0) {
                res.status(404).json({ status: 'error', message: "Like not found" });
                return;
            }
            res.status(200).json({ status: 'success', message: "Unliked successfully" });
        } catch (error) {
            next(error); // Pass errors to the next middleware for error handling
        }
    };

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
