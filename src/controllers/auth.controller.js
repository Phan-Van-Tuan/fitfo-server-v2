import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { email } = req.body;
            const user = await UserService.getUserByEmail(email);
            if (user) {
                return next({ status: 400, name: 'Bad Request', message: 'Email is exist' });
            }
            await AuthService.storeData(email, req.body);
            const otpCode = await AuthService.storeOTP(email);
            if (!otpCode) {
                return next({ status: 400, name: 'Bad Request', message: 'OTP is not created' });
            }
            return res.status(201).json({ otpCode });
            const result = await AuthService.sendEmail(email, otpCode);
            return res.status(201).json({ user });
        } catch (error) {
            next(error);
        }
    }

    async verifyOTP(req, res, next) {
        try {
            const { email, otpCode } = req.body;
            const user = await UserService.getUserByEmail(email);
            if (user) {
                return next({ status: 400, name: 'Bad Request', message: 'Email is exist' });
            }
            const data = await AuthService.verifyOTP(email, otpCode);
            const newUser = await AuthService.register(data)
            return res.status(200).json({ newUser });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const lowercaseEmail = email.toLowerCase();
            const data = await AuthService.login(lowercaseEmail, password);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const data = await AuthService.refreshToken(refreshToken);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const result = await AuthService.logout(req.data.userId);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res) {
        const { email, oldPassword, password } = req.body;
        const data = await AuthService.refreshToken(refreshToken);
        res.status(200).json(data);
    }

    async forgotPassword(req, res) {
        const { email, password } = req.body;
        const data = await AuthService.refreshToken(refreshToken);
        res.status(200).json(data);
    }


}

export default new AuthController();
