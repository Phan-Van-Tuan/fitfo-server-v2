import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';


function getDeviceInfo(req) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.connection.remoteAddress || '';

    // Bạn có thể mở rộng hàm này để bao gồm nhiều thông tin khác nếu cần
    return `${userAgent}-${ipAddress}`;
}

class AuthController {
    async register(req, res, next) {
        try {
            const { email } = req.body;
            const user = await UserService.getUserByEmail(email);
            if (user) {
                return next({ status: 422, name: 'Unprocessable Entity', message: 'Email is already in use' });
            }
            await AuthService.storeData(email, req.body);
            const otpCode = AuthService.generateOTP();
            await AuthService.storeOTP(email, otpCode);
            const result = await AuthService.sendEmail(email, otpCode);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async refreshOTP(req, res, next) {
        try {
            const { email } = req.body;
            const otpCode = AuthService.generateOTP();
            await AuthService.storeOTP(email, otpCode);
            return res.status(201).json({ otpCode });
        } catch (error) {
            next(error);
        }
    }

    async verifyOTP(req, res, next) {
        try {
            const { email, otpCode } = req.body;
            const user = await UserService.getUserByEmail(email);
            if (user) {
                return next({ status: 409, name: 'Conflict', message: 'Email already exists' });
            }
            const otp = await AuthService.getOTP(email);
            if (otp !== otpCode) {
                return next({ status: 400, name: 'Bad Request', message: 'Invalid OTP' });
            }
            const data = await AuthService.getData(email);
            const newUser = await AuthService.register(data);
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
