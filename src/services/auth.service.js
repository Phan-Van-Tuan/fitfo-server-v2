import OTP from '../models/otp.model.js';
import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import { hashCode, compareCode } from '../helpers/encryption.function.js';
import {
    generateAccessToken,
    generateRefreshToken,
    decodeRefreshToken,
} from '../helpers/jwt.function.js';
import nodemailer from 'nodemailer';
import html from '../helpers/mail.template.js';

import redis from 'redis';
const client = redis.createClient();

// Hàm thêm dữ liệu và đặt hẹn giờ
function addUserDataWaitRegister(token, data, ttl) {
    // Lưu dữ liệu vào Redis với key là token và giá trị là data
    client.setex(token, ttl, data);
}

// Hàm kiểm tra sự trùng lặp của cả token và dữ liệu
function getUserDataWaitRegister(token, data, callback) {
    // Lấy dữ liệu từ Redis với key là token
    client.get(token, (error, storedData) => {
        if (error) {
            // Xử lý lỗi nếu có
            console.error('Error getting data from Redis:', error);
            callback(false);
        } else {
            // Kiểm tra sự trùng lặp của cả token và dữ liệu
            if (storedData === data) {
                // Nếu giống nhau, xóa dữ liệu từ Redis và trả về true
                client.del(token);
                callback(true);
            } else {
                // Nếu không giống nhau, trả về false
                callback(false);
            }
        }
    });
}

class AuthService {

    generateOTP() {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        return otpCode
    }

    // storeOTP(otpCode, data) {
    //     if (userDataWaitRegister.hasOwnProperty(otpCode)) {
    //         return false
    //     }
    //     userDataWaitRegister[otpCode] = data;
    
    //     setTimeout(() => {
    //         delete userDataWaitRegister[otpCode];
    //     }, 30 * 1000);
    //     return true
    // }

    // async verifyOTP(email, otpCode) {
    //     return otp !== null;
    // }

    async register(firstName, lastName, email, password) {
        const lowercaseEmail = email.toLowerCase();
        const isExist = await User.find(lowercaseEmail);
        if (isExist) {
            throw { status: 400, message: 'Email is exist' }
        }
        const hashPassword = await hashCode(password);
        // const user = new _User({ firstName, lastName, email: lowercaseEmail, password: hashPassword });
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ email: email });
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
        const token = await Token.findOne({ userId: user._id });
        if (token) {
            token.token = refreshToken
            token.save();
        } else {
            const newToken = new Token({ userId: user._id, token: refreshToken });
            newToken.save();
        }
        return ({
            accessToken: accessToken,
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
            throw { status: 403, name: 'Forbidden', message: 'Token is wrong!' }
        }
        const token = await Token.findOne({ userId: data.data.userId });
        if (!token) {
            throw { status: 403, name: 'Forbidden', message: 'Do not logged in yet!' }
        }
        const newAccessToken = generateAccessToken(data.data);
        const newRefreshToken = generateRefreshToken(data.data);
        token.token = newRefreshToken;
        token.save();
        return ({
            accessToken: newAccessToken,
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
}

export default new AuthService();
