import AuthService from '../services/auth.service.js';

function getDeviceInfo(req) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.connection.remoteAddress || '';
    return `${userAgent}-${ipAddress}`;
}

class AuthController {
    async generateOTP(req, res) {
        const response = await AuthService.generateOTP(req.body);
        res.json(response);
    }

    async register(req, res) {
        const response = await AuthService.register(req.body);
        res.json(response);
    }

    async login(req, res) {
        const response = await AuthService.login(req.body);
        res.json(response);
    }

    async refreshToken(req, res) {
        const response = await AuthService.refreshToken(req.body);
        res.json(response);
    }

    async logout(req, res) {
        const response = await AuthService.logout(req.headers, req.body);
        res.json(response);
    }

    async changePassword(req, res) {
        const response = await AuthService.changePassword(req.body);
        res.json(response);
    }

    async resetPassword(req, res) {
        const response = await AuthService.resetPassword(req.body);
        res.json(response);
    }

    async forgotPassword(req, res) {
        const response = await AuthService.forgotPassword(req.body);
        res.json(response);
    }
}

export default new AuthController();
