import args from "../arguments.js";
import logger_dev from "./logger_dev.js";
import loggers_prod from "./loggers_prod.js";

let logger = null;

switch(args.mode) {
    case "prod":
        logger = loggers_prod;
        break;
    default: //dev
        logger = logger_dev;
        break;
}
export default logger;
