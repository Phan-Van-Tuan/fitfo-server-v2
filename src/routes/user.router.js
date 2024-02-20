import Router from 'express-promise-router';
const router = Router();

import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../helpers/authentication.middleware.js'
import {
    registerValidationMiddleware,
    loginValidationMiddleware
} from '../helpers/validation.middleware.js'


router.post('/register', registerValidationMiddleware, UserController.register);

router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);

router.post('/logout', authMiddleware, UserController.logout);
router.route('/').get(authMiddleware, UserController.getAllUsers);
router.use('/', (req, res) => {
    res.json('this is user router')
});

export default router;