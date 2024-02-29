const authorizeMiddleware = (req, res, next) => {
    try {
        if (req.data.role !== 'admin') {
            return next({ status: 401, name: 'Unauthorized', message: 'You are not authorized' });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }

}