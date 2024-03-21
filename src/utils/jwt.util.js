import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

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
    generateToken,
    decodeToken,
};