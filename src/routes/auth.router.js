import express from 'express';
const router = express.Router();

import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../helpers/authentication.middleware.js'
import {
    registerValidationMiddleware,
    emailAndPasswordValidationMiddleware
} from '../helpers/validation.middleware.js'

router.post('/register', registerValidationMiddleware, AuthController.register);
router.post('/verify', AuthController.verifyOTP);

router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', authMiddleware, AuthController.logout);

router.post('/reset-password', authMiddleware, emailAndPasswordValidationMiddleware, AuthController.resetPassword);
router.post('/forgot-password', emailAndPasswordValidationMiddleware, AuthController.forgotPassword);



export default router;
