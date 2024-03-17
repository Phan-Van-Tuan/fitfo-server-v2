import { decodeToken } from '../helpers/jwt.function.js';
import Token from '../models/token.model.js'

const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new TokenMissingException();
            }

            const token = authHeader.replace(bearer, '');
            const data = decodeToken(token);

            const user = await Token.findOne({ userId: data.userId });
            if (!user) {
                return next({ status: 401, name: 'Unauthorized', message: 'You need to log in' });
            }

            // check if the current user is the owner user
            // const ownerAuthorized = req.params.id == user.user_id; //cant update self
            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (/*! ownerAuthorized || */(roles.length && !roles.includes(user.role))) {
                throw new UnauthorizedException();
            }

            // if the user has permissions
            req.currentUser = user;
            next();
        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
};

export { auth };
