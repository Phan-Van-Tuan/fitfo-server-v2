import express from 'express';
const router = express.Router();

import UserController from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

router.put('/update-profile', UserController.updateProfile);
router.route('/').get(auth, UserController.getAllUsers);

export default router;