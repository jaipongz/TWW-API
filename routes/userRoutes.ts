const express = require('express');
const userRouter = express.Router();
const multer = require('multer');
const path = require('path');
import { userController } from '../controllers/userController';
import { verifyToken } from '../Middleware/authMiddleware';
const passport = require('../Middleware/google');
const storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
      cb(null, 'src/storage/profilePic');
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
userRouter.get('/generateToken', userController.genToken);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', verifyToken, userController.logout);
userRouter.get('/test', verifyToken, userController.test);
userRouter.get('/checkDraft', verifyToken, userController.checkDraft);
userRouter.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

userRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect to the desired page.
    //   res.redirect('/dashboard');
    console.log('Google Auth');

  }
);

userRouter.post('/verifiedEmail',userController.verifyEmail);
userRouter.post('/forgotPassword',userController.forgot);
userRouter.post('/verifyPassword',userController.verify);
userRouter.post('/resetPassword',userController.resetPassword);
userRouter.post('/api/user/updateProfilePic',verifyToken,upload.single('profile_pic'),userController.updateProfile);
userRouter.get('/api/user/getProfile',verifyToken,userController.getProfile);
userRouter.get('/api/user/getCountNovel',verifyToken,userController.getCountNovel);
export { userRouter };
