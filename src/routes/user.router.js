import express from 'express';
const router = express.Router();

import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../helpers/authentication.middleware.js';

router.route('/').get(authMiddleware, UserController.getAllUsers);

export default router;