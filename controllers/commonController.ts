import { Request, Response } from 'express';
const commonService = require('../services/commonService');
const userService = require('../services/userService');


export class commonController {

    public static async postComment(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const { novelId, chapterId, content } = req.body;
            console.log(req.body);
            const response = await commonService.postComment(novelId, chapterId, userId, content);
            if (response) {
                res.status(201).json({ status: 'success', message: "Comment added successfully" });
            } else {
                res.status(500).json({ status: 'fail', message: "Failed to add comment" });
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            res.status(500).json({ status: 'error', message: 'An unexpected error occurred while adding the comment' });
        }
    }

    public static async updateComment(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            if (!content) {
                res.status(400).json({ status: 'fail', message: 'Content is required to update the comment' });
            }
            const [response] = await commonService.updateComment(commentId, content);
            if (response.affectedRows > 0) {
                res.status(200).json({ status: 'success', message: "Comment updated successfully" });
            } else {
                res.status(404).json({ status: 'fail', message: "Comment not found" });
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            res.status(500).json({ status: 'error', message: 'An unexpected error occurred while updating the comment' });
        }
    }

    public static async deleteComment(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        const { commentId } = req.params;
        try {
            const response = await commonService.deleteComment(commentId);
            if (response && response.affectedRows === 0) {
                res.status(404).json({ status: 'error', message: "Comment not found" });
                return;
            }
            res.status(200).json({ status: 'success', message: "Comment deleted successfully" });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'An unexpected error occurred while delete the comment' });
        }
    };

    public static async getCommentsByNovel(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { novelId } = req.params;
            const response = await commonService.getCommentsByNovel(novelId);
            if (response) {
                res.status(200).json({ status: 'success', data: response });
            }
        } catch (error) {
            res.status(500).json({ status: 'error', message: error });
        }

    }

    public static async getCommentsByChapter(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        const { chapterId } = req.params;
        const response = await commonService.getCommentsByChapter(chapterId);
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }
    public static async mainGroup(req: Request, res: Response) {
        // #swagger.tags = ['Global']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        const response = await commonService.mainGroup();
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }
    public static async subGroup(req: Request, res: Response) {
        // #swagger.tags = ['Global']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        const response = await commonService.subGroup();
        if (response) {
            res.status(200).json({ status: 'success', data: response });
        }
    }

    public static async addLike(req: Request, res: Response) {
        // #swagger.tags = ['Communication']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const userData = req.user;
            const userId = await userService.decrypt(userData);
            const { novelId, chapterId } = req.body;
            const result = await commonService.addLike(res, novelId, chapterId, userId);
            if (result) {
                res.status(201).json({ status: 'success', message: "Liked successfully" });
            }
        } catch (error) {
            res.status(500).json({ status: 'error', message: error });
        }
    }

    // public static removeLike: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { novelId, chapterId, userId } = req.body;
    //     try {
    //         const result = await CommonService.removeLike(novelId, chapterId, userId);
    //         if (result && result.affectedRows === 0) {
    //             res.status(404).json({ status: 'error', message: "Like not found" });
    //             return;
    //         }
    //         res.status(200).json({ status: 'success', message: "Unliked successfully" });
    //     } catch (error) {
    //         next(error); // Pass errors to the next middleware for error handling
    //     }
    // };

    // public static async getLikeCountByNovel(req: Request, res: Response) {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { novelId } = req.params;
    //     const response = await CommonService(CommonService.getLikeCountByNovel, res, novelId);
    //     if (response) {
    //         res.status(200).json({ status: 'success', data: response });
    //     }
    // }

    // public static async getLikeCountByChapter(req: Request, res: Response) {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { chapterId } = req.params;
    //     const response = await CommonService(CommonService.getLikeCountByChapter, res, chapterId);
    //     if (response) {
    //         res.status(200).json({ status: 'success', data: response });
    //     }
    // }

    // public static async shareNovelOrChapter(req: Request, res: Response) {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { novelId, chapterId, userId } = req.body;
    //     const result = await CommonService(CommonService.shareNovelOrChapter, res, novelId, chapterId, userId);
    //     if (result) {
    //         res.status(201).json({ status: 'success', message: "Shared successfully" });
    //     }
    // }

    // public static async getShareCountByNovel(req: Request, res: Response) {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { novelId } = req.params;
    //     const response = await CommonService(CommonService.getShareCountByNovel, res, novelId);
    //     if (response) {
    //         res.status(200).json({ status: 'success', data: response });
    //     }
    // }

    // public static async getShareCountByChapter(req: Request, res: Response) {
    //     // #swagger.tags = ['Communication']
    //     /* #swagger.security = [{
    //         "Bearer": []
    //     }] */
    //     const { chapterId } = req.params;
    //     const response = await CommonService(CommonService.getShareCountByChapter, res, chapterId);
    //     if (response) {
    //         res.status(200).json({ status: 'success', data: response });
    //     }
    // }
}
