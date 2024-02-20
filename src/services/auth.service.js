import _OTP from '../models/otp.model.js';
import _User from '../models/user.model.js';
import _Token from '../models/token.model.js';
import { hashCode, compareCode } from '../helpers/encryption.function.js';
import {
    generateAccessToken,
    generateRefreshToken,
    decodeRefreshToken,
} from '../helpers/jwt.function.js';
import nodemailer from 'nodemailer';
import html from '../helpers/mail.template.js';

class AuthService {
    
    async register(firstName, lastName, email, password) {
        const isExist = await _User.find(email);
        if (isExist) {
            throw { status: 400, message: 'Email is exist' }
        }
        const hashPassword = await hashCode(password);
        const user = new _User({ firstName, lastName, email, password: hashPassword });
        return user;
    }

    async login(email, password) {
        const user = await _User.findOne({ email: email });
        if (!user) {
            throw { status: 400, message: 'Email is not already' }
        }
        if (!(await compareCode(password, user.password))) {
            throw { status: 401, message: 'Password is wrong' }
        }
        const data = {
            userId: user._id,
            role: user.role
        }
        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);
        const token = await _Token.findOne({ userId: user._id });
        if (token) {
            token.token = refreshToken
            token.save();
        } else {
            const newToken = new _Token({ userId: user._id, token: refreshToken });
            newToken.save();
        }
        return ({
            accessToken: `Bearer ${accessToken}`,
            refreshToken: refreshToken
        });
    }

    async logout(userId) {
        await _Token.findOneAndDelete({ userId: userId });
        return "Deleted oge";
    }

    async refreshToken(refreshToken) {
        const data = decodeRefreshToken(refreshToken);
        if (!data) {
            throw { status: 403, message: 'Token is wrong!' }
        }
        const token = await _Token.findOne({ userId: data.payload.userId });
        if (!token) {
            throw { status: 403, message: 'Do not logged in yet!' }
        }
        const newAccessToken = generateAccessToken(data.payload);
        const newRefreshToken = generateRefreshToken(data.payload);
        token.token = newRefreshToken;
        token.save();
        return ({
            accessToken: `Bearer ${newAccessToken}`,
            refreshToken: newRefreshToken
        });
    }

    async sendEmail(email, otpCode) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"Fitfo" <admin>', // sender address
            to: email, // list of receivers
            subject: "Authenticate Registration", // Subject line
            text: "Hello world?", // plain text body
            html: html(otpCode), // html body
        });
        return info;
    }

    async generateOTP(email) {
        // Tạo mã OTP ngẫu nhiên (đoạn này có thể sử dụng thư viện như 'crypto' để tạo mã ngẫu nhiên an toàn hơn)
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const otp = new _OTP({
            email,
            otpCode,
        });
        await otp.save();
        return otpCode
    }

    async verifyOTP(email, otpCode) {
        const otp = await _OTP.findOneAndDelete({ email, otpCode });
        return otp !== null;
    }
}

export default new AuthService();
