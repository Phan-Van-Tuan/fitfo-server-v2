import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const generateAccessToken = (data) => {
    return sign({
        data: data,
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    )
}

const decodeAccessToken = (token) => {
    return verify(token, process.env.ACCESS_TOKEN_SECRET);
}

const generateRefreshToken = (data) => {
    return sign({
        data: data,
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    )
}

const decodeRefreshToken = (token) => {
    return verify(token, process.env.REFRESH_TOKEN_SECRET);
}

const generateToken = (data, expire) => {
    return sign({
        data: data,
    },
        process.env.TOKEN_SECRET,
        { expiresIn: expire }
    )
}

const decodeToken = (token) => {
    return verify(token, process.env.TOKEN_SECRET);
}

export {
    generateAccessToken,
    decodeAccessToken,
    generateRefreshToken,
    decodeRefreshToken,
    generateToken,
    decodeToken,
};