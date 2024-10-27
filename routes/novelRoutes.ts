const express = require('express');
const novelRouter = express.Router();
const multer = require('multer');
const path = require('path');
import { userController } from '../controllers/userController';
const authMiddleware = require("../Middleware/authMiddleware");
import { novelController } from '../controllers/novelController';

const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
        cb(null, 'src/storage/novelPropic');
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

novelRouter.post('/api/novel/storeNovel',authMiddleware,upload.single('novel_propic'), novelController.createNovel);
novelRouter.get('/api/novel/getNovelList', novelController.getNovel);
novelRouter.get('/api/novel/getNovelDetail/:novelId', novelController.getNovelDetail);
novelRouter.delete('/api/novel/destroyNovel/:novelId',authMiddleware, novelController.destroyNovel);
novelRouter.put('/api/novel/updateNovel/:novelId',authMiddleware, upload.single('novel_propic'), novelController.updateNovel);
novelRouter.post('/api/novel/addChapter',authMiddleware,novelController.createDescChapter);
export { novelRouter };