import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Thay 'User' bằng tên của mô hình người dùng nếu cần
        },
        token: {
            type: String,
            required: true,
        },
        expireAt: {
            type: Date,
            default: Date.now() + 30 * 24 * 60 * 60 * 1000,
            expires: 0,
        },
    },
    { timestamps: true }
);

const Token = mongoose.model('Token', tokenSchema);
export default Token;