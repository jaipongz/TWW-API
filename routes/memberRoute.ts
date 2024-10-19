const express = require('express');
const memberRouter = express.Router();
import { userController } from '../controllers/userController';
const authMiddleware = require("../Middleware/authMiddleware");

import { memberController } from '../controllers/memberController';
memberRouter.post('/createMember', memberController.membership);


export { memberRouter };