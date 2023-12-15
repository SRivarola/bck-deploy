import MyRouter from "../router.js";

export default class LoggersRoute extends MyRouter {
    init() {
        this.read(
            '/',
            ["USER"], 
            (req, res, next) => {
                try {
                    req.logger.HTTP(
                        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
                    )
                    req.logger.INFO(
                        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
                    )
                    req.logger.ERROR(
                        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
                    )
                    req.logger.FATAL(
                        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
                    )
                    return res.status(200).send('Log request succesfully.')
                } catch (error) {
                    next(error);
                }
            }
        )
    }
}