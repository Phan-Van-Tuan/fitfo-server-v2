import express from 'express';
const router = express.Router();

import AuthController from '../controllers/auth.controller.js';

import {
    auth,
    awaitHF
} from '../middlewares/index.js';

router.post('/register', awaitHF(AuthController.register));
router.post('/generate-otp', awaitHF(AuthController.generateOTP));

router.post('/login', awaitHF(AuthController.login));
router.post('/refresh-token', awaitHF(AuthController.refreshToken));
router.post('/logout', auth(), awaitHF(AuthController.logout));

router.post('/change-password', auth(), awaitHF(AuthController.changePassword));
router.post('/reset-password', awaitHF(AuthController.resetPassword));
router.post('/forgot-password', awaitHF(AuthController.forgotPassword));



export default router;
