import { InternalServerException } from '../utils/exceptions/api.exception';
import { TokenVerificationException, TokenExpiredException } from '../utils/exceptions/auth.exception';

function errorMiddleware(err, req, res, next) {
    // Xử lý lỗi JWT
    if (err.name === "JsonWebTokenError") {
        err = new TokenVerificationException();
    } else if (err.message === "jwt expired") {
        err = new TokenExpiredException();
    }

    // Xử lý lỗi 500 và lỗi không phản hồi từ các middleware khác
    if (err.status === 500 || !err.message) {
        if (!err.isOperational) {
            err = new InternalServerException('Internal server error');
        }
    }

    // Lấy thông tin từ lỗi
    let { message, code, error, status, data, stack } = err;

    // In ra thông tin lỗi trong môi trường development
    if (process.env.NODE_ENV === "dev") {
        console.log(`[Exception] ${error}, [Code] ${code}`);
        console.log(`[Error] ${message}`);
        console.log(`[Stack] ${stack}`);
    }

    // Chuẩn bị header
    const headers = {
        success: "0",
        error,
        code,
        message,
        ...(data && { data }),
    };

    // Trả về lỗi dưới dạng JSON
    res.status(status).send({ headers, body: {} });
}

export default errorMiddleware;
