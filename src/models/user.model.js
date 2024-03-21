import { Schema, model } from "mongoose";

const userShema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName: { type: String, require: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: {
            type: String,
            default: "https://firebasestorage.googleapis.com/v0/b/fitfo-storage.appspot.com/o/avatars%2Flogo_default.png?alt=media&token=7d6ef2a3-383d-430d-a94c-89e272ae1dea",
        },
        role: {
            type: String,
            enum: ["user", "censor", "admin"],
            default: "user",
        },
        gender: {
            type: String,
            enum: ["male", "female", "other", "default"],
            default: "default",
        },
        birthday: { type: String, default: "default" },
        account: {
            type: String,
            enum: ["default", "google"],
            default: "default"
        },
    },
    { timestamps: true }
);

const User = model('User', userShema);
export default User;
