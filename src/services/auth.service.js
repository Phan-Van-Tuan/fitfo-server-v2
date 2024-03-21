import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import User from '../models/user.model.js';
import Token from '../models/token.model.js';

import E from '../utils/error.util.js';
import html from '../utils/mail.template.js';
import BlackList from "../utils/blackList.util.js";
import { setValue, getValue, delValue } from '../utils/redis.util.js';


class AuthService {
    // ---------------   Main Function ----------------------------
    generateOTP = async (body) => {
        const email = body.email.toLowerCase();

        const user = await User.findOne({ email });
        if (user) { throw new E(400, "User already exists") };

        const otpCode = this.createOTP();
        if (!otpCode) { throw new E(501, "Failed to create OTP") };

        await setValue(`${email}`, otpCode, 60 * 3); // 3 minutes

        const result = await this.sendEmail(email, otpCode);

        return result;
    }

    register = async (body) => {
        this.verifyOTP(body);
        const email = body.email.toLowerCase();

        const user = await User.findOne({ email });
        if (user) { throw new E(400, "User already exists") };

        const password = await bcrypt.hash(body.password, 5);

        const { firstName, lastName, userName } = body;
        const newUser = new User(firstName, lastName, userName, email, password);
        newUser.save();

        return "Registered successfully";
    }

    login = async (body) => {
        const email = body.email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) { throw new E(400, 'Email is not already') };

        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) { throw new E(401, 'Password is wrong') };

        const data = { userId: user._id, role: user.role }

        const accessToken = jwt.sign(
            { data },
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 10 } // 10 minutes
        );

        const refreshToken = jwt.sign(
            { data },
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 60 * 24 * 30 } // 30 days
        );

        const token = new Token({ userId: user._id, token: refreshToken });
        token.save();

        return ({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }

    refreshToken = async (body) => {
        const { data } = jwt.verify(body.refreshToken, process.env.TOKEN_SECRET);
        if (!data) { throw new E(403, 'Token is wrong!') }

        const isExist = await Token.findOne({ token: body.refreshToken });
        if (!isExist) { throw new E(403, 'Token does not exist') };

        const newAccessToken = jwt.sign(
            { data },
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 10 } // 10 minutes
        );
        const newRefreshToken = jwt.sign(
            { data },
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 60 * 24 * 30 } // 30 days
        );


        isExist.token = newRefreshToken;
        isExist.save();

        return ({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    }

    logout = async (headers, body) => {
        const refreshToken = await Token.findOneAndDelete({ token: body.refreshToken });
        if (!refreshToken) { throw new E(401, "error missingtoken") }

        const authHeader = headers['authorization'];
        const bearer = 'Bearer ';
        const accessToken = authHeader.replace(bearer, '');

        await BlackList.push_token(accessToken, "logout");

        return "Log out successfully";
    }

    changePassword = async (body) => {
        const { userId } = body.currentUser;

        const user = await User.findById(userId);
        if (!user) { throw new E(400, 'Email is not already') };

        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) { throw new E(401, 'Password is wrong') };

        const password = await bcrypt.hash(body.newPassword, 5);
        user.password = password;
        user.save();

        return "Changed password successfully";
    }

    resetPassword = async (body) => {
        this.verifyOTP(body);

        const email = body.email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) { throw new E(400, 'Email is not already') };

        const password = await bcrypt.hash(body.password, 5);
        user.password = password;
        user.save();

        return "Reset password successfully";
    }

    forgotPassword = async (body) => {
        this.verifyOTP(body);

        const email = body.email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) { throw new E(400, 'Email is not already') };

        const data = { userId: user._id, role: user.role }

        const accessToken = jwt.sign(
            data,
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 10 } // 10 minutes
        );

        const refreshToken = jwt.sign(
            data,
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 60 * 24 * 30 } // 30 days
        );

        const token = new Token({ userId: user._id, token: refreshToken });
        token.save();

        return ({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }

    //    ----------- Child Function ---------------------
    createOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    verifyOTP = async (body) => {
        const email = body.email.toLowerCase();

        const otp = await getValue(`${email}`);
        if (!otp) { throw new E(400, "OTP has not been generated or has expired") };
        if (otp !== body.otpCode) { throw new E(400, "Invalid OTP") };

        await delValue(`${email}`);

        return true;
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
