const express = require('express');
const userRouter = express.Router();
import { userController } from '../controllers/userController';
const authMiddleware = require("../Middleware/authMiddleware");
const passport = require('../Middleware/google');
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', authMiddleware, userController.logout);
userRouter.get('/test', authMiddleware, userController.test);
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

userRouter.post('/forgotPassword',userController.forgot);
userRouter.post('/verifyPassword',userController.verify);
userRouter.post('/resetPassword',userController.resetPassword);
export { userRouter };
