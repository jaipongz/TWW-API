const express = require('express');
const memberRouter = express.Router();
import { userController } from '../controllers/userController';
import { verifyToken } from '../Middleware/authMiddleware';
import { memberController } from '../controllers/memberController';

memberRouter.post('/createMember', memberController.requestMembership);


export { memberRouter };