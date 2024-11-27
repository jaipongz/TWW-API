const express = require('express');
const novelRouter = express.Router();
const multer = require('multer');
const path = require('path');
import { verifyToken } from '../Middleware/authMiddleware';
import { novelController } from '../controllers/novelController';

const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        cb(null, 'src/storage/novelPropic');
    },
    filename: function (req:any, file:any, cb:any) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const charactor = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        cb(null, 'src/storage/charactor');
    },
    filename: function (req:any, file:any, cb:any) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const media = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        cb(null, 'src/storage/media');
    },
    filename: function (req:any, file:any, cb:any) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req:any, file:any, cb:any) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

const uploadCharPic = multer({
    storage: charactor,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req:any, file:any, cb:any) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});
const uploadMedia = multer({
    storage: media,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req:any, file:any, cb:any) => {
        const mimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/mkv'];
        if (mimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'), false);
        }
    }
});

novelRouter.post('/api/novel/storeNovel',verifyToken,upload.single('novel_propic'), novelController.createNovel);
novelRouter.get('/api/novel/getNovelList', novelController.getNovel);
novelRouter.get('/api/novel/getNovelDetail/:novelId', novelController.getNovelDetail);
novelRouter.delete('/api/novel/destroyNovel/:novelId',verifyToken, novelController.destroyNovel);
novelRouter.put('/api/novel/updateNovel/:novelId',verifyToken, upload.single('novel_propic'), novelController.updateNovel);
novelRouter.post('/api/novel/addChapter',verifyToken,novelController.createDescChapter);
novelRouter.get('/api/novel/myNovelList',verifyToken,novelController.myNovelList);

novelRouter.post('/api/novel/charactor',verifyToken,uploadCharPic.single('charPic'),novelController.createChar);
novelRouter.put('/api/novel/charactor/:charId',verifyToken,uploadCharPic.single('charPic'),novelController.updateChar);
novelRouter.delete('/api/novel/charactor/:charId',verifyToken,novelController.deleteChar);
novelRouter.get('/api/novel/charactor/:charId',verifyToken,novelController.getCharById);
novelRouter.get('/api/novel/allCharactor/:novelId',verifyToken,novelController.getAllChar);


novelRouter.post('/api/novel/chapterChat',novelController.createChat);
novelRouter.post('/api/novel/chat/massage',novelController.message);
novelRouter.put('/api/novel/chat/massage/:messageId',novelController.updateMessage);
novelRouter.delete('/api/novel/chat/massage/:messageId',novelController.deleteMessage);
novelRouter.post('/api/novel/chat/media',uploadMedia.single('media'),novelController.media);

novelRouter.post('/api/novel/chat/save/:chapterId',novelController.saveMessage);

export { novelRouter };