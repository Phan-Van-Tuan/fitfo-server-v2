import mongoose from 'mongoose';
const { Schema } = mongoose;

const otpSchema = new Schema(
    {
        email: { type: String, required: true },
        otpCode: { type: String, required: true },
        expireAt: {
            type: Date,
            default: Date.now() + 3 * 60 * 1000,
            expires: 0,
        },
    }, { timestamps: true }
);

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
