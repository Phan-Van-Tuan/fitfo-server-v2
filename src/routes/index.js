import express from 'express';
const router = express.Router();

import UserRoute from './user.router.js';
import AuthRoute from './auth.router.js';

router.use('/user/', UserRoute);
router.use('/auth/', AuthRoute);
router.use('/', (req, res) => { res.status(200).send('Welcome to fitfo API') });

export default router;
