import { decodeAccessToken } from '../helpers/jwt.function.js';
import Token from '../models/token.model.js'

const authMiddleware = async (req, res, next) => {
    try {
        const bearerAccessToken = req.headers['authorization'];
        if (!bearerAccessToken) {
            return next({ status: 403, name: 'Forbidden', message: 'Missing token' });
        }
        const accessToken = bearerAccessToken.slice(7);
        const data = decodeAccessToken(accessToken);
        const isExistToken = await Token.findOne({ userId: data.userId });
        if (!isExistToken) {
            return next({ status: 401, name: 'Unauthorized', message: 'You need to log in' });
        }
        req.data = { data }
        next();
    } catch (error) {
        next(error);
    }
};

export { authMiddleware };
