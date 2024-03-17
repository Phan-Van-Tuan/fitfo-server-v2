import { InvalidEndpointException } from './utils/exceptions/api.exception.js';
import errorMiddleware from './middleware/error.middleware.js';

class MiddlewareLoader {
    static init(app) {
        // 404 endpoint handler
        app.all('*', (req, res, next) => {
            const err = new InvalidEndpointException();
            next(err);
        });

        // Error middleware
        app.use(errorMiddleware);
    }
}

export default MiddlewareLoader;