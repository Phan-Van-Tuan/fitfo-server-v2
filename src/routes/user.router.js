import express from 'express';
const router = express.Router();

import UserController from '../controllers/user.controller.js';

import middleware from '../middlewares/index.js';

router.get('/:id', middleware.auth(), middleware.awaitHF(UserController.getProfile));
router.put('/update-profile', middleware.auth(), middleware.awaitHF(UserController.updateProfile));

export default router;