const express = require('express');
import { commonController } from '../controllers/commonController';
import { verifyToken } from '../Middleware/authMiddleware';

const commonRouter = express.Router();

commonRouter.get('/mainGroup',commonController.mainGroup);
commonRouter.get('/subGroup',commonController.subGroup);
commonRouter.get('/recTag',commonController.recTag);

commonRouter.post('/comments',verifyToken,commonController.postComment);
commonRouter.delete('/comments/:commentId',verifyToken,  commonController.deleteComment);
commonRouter.put('/comments/:commentId',verifyToken, commonController.updateComment);
commonRouter.get('/comments/novel/:novelId', commonController.getCommentsByNovel);
commonRouter.get('/comments/chapter/:chapterId', commonController.getCommentsByChapter);

commonRouter.post('/likes', verifyToken, commonController.addLike);
// commonRouter.delete('/likes',  commonController.removeLike);
// commonRouter.get('/likes/count/novel/:novelId', commonController.getLikeCountByNovel);
// commonRouter.get('/likes/count/chapter/:chapterId', commonController.getLikeCountByChapter);

// commonRouter.post('/shares', commonController.shareNovelOrChapter);
// commonRouter.get('/shares/count/novel/:novelId', commonController.getShareCountByNovel);
// commonRouter.get('/shares/count/chapter/:chapterId', commonController.getShareCountByChapter);

export  {commonRouter};
