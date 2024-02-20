import Router from 'express-promise-router';
const router = Router();

import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../helpers/authentication.middleware.js'
import {
    registerValidationMiddleware,
    loginValidationMiddleware
} from '../helpers/validation.middleware.js'

router.post('/check-email-and-generate-otp', registerValidationMiddleware, AuthController.sendOTP);
router.post('/verify-otp-and-register', AuthController.verifyOTP);

router.post('/login', UserController.login);

router.post('/refresh-token', UserController.refreshToken);

router.post('/logout', authMiddleware, UserController.logout);

router.post('/test', AuthController.test);

export default router;
