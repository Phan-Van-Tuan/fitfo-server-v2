import express from 'express';
const router = express.Router();

import AuthController from '../controllers/auth.controller.js';

import middleware from '../middlewares/index.js';

router.post('/register', middleware.awaitHF(AuthController.register));
router.post('/generate-otp', middleware.awaitHF(AuthController.generateOTP));

router.post('/login', middleware.awaitHF(AuthController.login));
router.post('/refresh-token', middleware.awaitHF(AuthController.refreshToken));
router.post('/logout', middleware.auth(), middleware.awaitHF(AuthController.logout));

router.post('/change-password', middleware.auth(), middleware.awaitHF(AuthController.changePassword));
router.post('/reset-password', middleware.awaitHF(AuthController.resetPassword));
router.post('/forgot-password', middleware.awaitHF(AuthController.forgotPassword));



export default router;
