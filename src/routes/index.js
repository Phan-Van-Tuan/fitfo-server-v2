import Router from 'express-promise-router';
import UserRoute from './user.router.js';
import AuthRoute from './user.router.js';
import OTPRoute from './otp.router.js'
const router = Router();


router.use('/user/', UserRoute);
router.use('/auth/', AuthRoute);
router.use('/otp/', OTPRoute);
router.use('/', (req, res) => { res.status(200).send('Welcome to fitfo API') });

export default router;
