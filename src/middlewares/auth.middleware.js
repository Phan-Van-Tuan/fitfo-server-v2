import { decodeToken } from '../utils/jwt.util.js';
import blackList from '../utils/blackList.util.js';

const auth = (...roles) => {
    return async function (req, res, next) {
        try {

            const authHeader = req.headers['authorization'];
            const bearer = 'Bearer ';
            // return next();

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new Error("Missing token!");
            }

            const token = authHeader.replace(bearer, '');

            const authorized = blackList.map_token(token);
            if (!authorized) { throw new Error("Black list") }

            const data = decodeToken(token);
            
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

export default auth;
