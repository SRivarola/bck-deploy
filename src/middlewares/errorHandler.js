import logger from '../config/logger/factory.js';

const errorHandler = (error, req, res, next) => {
    req.logger = logger;
    if(`${error.statusCode}`.startsWith("4")) {
        req.logger.ERROR(
            `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - ${error.message}`
        )
    } else {
        req.logger.FATAL(
            `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - ${error.message}`
        )
    }
    return res.status(error.statusCode).json({
        method: req.method,
        path: req.url,
        message: error.message
    })
}

export default errorHandler;