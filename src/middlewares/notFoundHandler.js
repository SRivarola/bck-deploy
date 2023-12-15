import logger from '../config/logger/factory.js';

const notFoundHandler = (req, res, next) => {
    req.logger = logger;
    req.logger.ERROR(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - not found path.`
    );
    return res.status(404).json({
        method: req.method,
        path: req.url,
        message: "not found."
    })
}
export default notFoundHandler;