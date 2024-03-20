import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import { hashCode, compareCode } from '../helpers/encryption.function.js';
import {
    generateAccessToken,
    generateRefreshToken,
    decodeRefreshToken,
    generateToken,
    decodeToken,
} from '../helpers/jwt.function.js';
import {
    setValue,
    getValue,
    delValue
} from '../config/connectionRedis.js'
import nodemailer from 'nodemailer';
import html from '../helpers/mail.template.js';

class AuthService {
    // async register(req, res, next) {
    //     try {
    //         const { email } = req.body;
    //         const user = await UserService.getUserByEmail(email);
    //         if (user) {
    //             return next({ status: 422, name: 'Unprocessable Entity', message: 'Email is already in use' });
    //         }
    //         await AuthService.storeData(email, req.body);
    //         const otpCode = AuthService.generateOTP();
    //         await AuthService.storeOTP(email, otpCode);
    //         const result = await AuthService.sendEmail(email, otpCode);
    //         return res.status(201).json(result);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    generateOTP() {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        return otpCode
    }

    async storeData(email, jsonData) {
        try {
            const lowercaseEmail = email.toLowerCase();
            const stringData = JSON.stringify(jsonData);
            await setValue(`data[${lowercaseEmail}]`, stringData, 60 * 10);
            return email;
        } catch (error) {
            throw error;
        }
    }

    async storeOTP(email, otpCode) {
        try {
            const lowercaseEmail = email.toLowerCase();
            const result = await setValue(`${lowercaseEmail}`, otpCode, 60 * 10);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getOTP(email) {
        try {
            const lowercaseEmail = email.toLowerCase();
            const otpCode = await getValue(`${lowercaseEmail}`);
            if (!otpCode) {
                throw new Error('Email is not exist');
            } else {
                return otpCode;
            }
        } catch (error) {
            throw error;
        }
    }

    async getData(email) {
        try {
            const lowercaseEmail = email.toLowerCase();
            const stringData = await getValue(`data[${lowercaseEmail}]`);
            if (!stringData) {
                throw new Error('Data does not exist');
            }
            const jsonData = JSON.parse(stringData);
            return jsonData;
        } catch (error) {
            throw error;
        }
    }


    async register(data) {
        try {
            const { firstName, lastName, userName, email, password } = data;
            const lowercaseEmail = email.toLowerCase();
            const user = new User({ firstName, lastName, userName, email: lowercaseEmail, password });
            user.save();
            return user;
        } catch (error) {
            throw error;
        }
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
