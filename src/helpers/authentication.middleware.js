import { decodeAccessToken } from '../helpers/jwt.function.js';
import _Token from '../models/token.model.js'

const authMiddleware = async (req, res, next) => {
    let bearerAccessToken = req.headers['authorization'];
    if (!bearerAccessToken) {
        return next({ status: 401, message: 'Unauthorized - Missing token' });
    }
    let accessToken = bearerAccessToken.slice(7);
    let data = decodeAccessToken(accessToken);
    req.data = data.payload;
    next();
};

export { authMiddleware };
