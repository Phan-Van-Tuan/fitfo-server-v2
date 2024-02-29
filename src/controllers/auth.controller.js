import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { firstName, lastName, userNane, email, password } = req.body;
            const lowercaseEmail = email.toLowerCase();
            const user = await UserService.getUserByEmail(lowercaseEmail);
            if (user) {
                return next({ status: 400, name: 'Bad Request', message: 'Email is exist' });
            }
            const otpCode = await AuthService.generateOTP(email);
            const result = await AuthService.sendEmail(email, otpCode);
            // const user = await AuthService.register(firstName, lastName, userNane, email, password);
            return res.status(201).json({ user });
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

    async sendOTP(req, res) {
        const { firstName, lastName, userName, email, password } = req.body;
        const user = await UserService.getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'Email is exist' });
        }
        const otpCode = await AuthService.generateOTP(email);
        const result = await AuthService.sendEmail(email, otpCode);
        return res.status(204).json({ result });
    }

    async verifyOTP(req, res) {
        const { email, otpCode } = req.body;
        const isVerified = await AuthService.verifyOTP(email, otpCode);
        return res.status(200).json({ isVerified });
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
