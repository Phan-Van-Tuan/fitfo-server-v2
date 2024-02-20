import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';

class AuthController {
    async register(req, res) {
        const { email } = req.body;
        const lowercaseEmail = email.toLowerCase();
        const user = await UserService.register(lowercaseEmail);
        res.status(201).json({ user });
    }

    async login(req, res) {
        const { email, password } = req.body;
        const lowercaseEmail = email.toLowerCase();
        const data = await UserService.login(lowercaseEmail, password);
        res.status(200).json(data);
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        const data = await UserService.refreshToken(refreshToken);
        res.status(200).json(data);
    }

    async logout(req, res) {
        const result = await UserService.logout(req.data.userId);
        res.json(result);
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
        const { refreshToken } = req.body;
        const data = await UserService.refreshToken(refreshToken);
        res.status(200).json(data);
    }

    // async test(req, res) {
    //     const isVerified = await AuthService.sendEmail("tuank17a2yt3123@gmail.com", "đây là otp của thắng béo: 473275");
    //     return res.status(200).json({ isVerified });
    // }
}

export default new AuthController();
