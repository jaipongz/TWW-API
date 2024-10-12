const express = require('express');
const userRouter = express.Router();
import {userController} from '../controllers/userController';
const authMiddleware = require("../Middleware/authMiddleware");

userRouter.post('/register',userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/test', authMiddleware, userController.test);

export {userRouter};
