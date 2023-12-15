import User from "../dao/models/user.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default (req, res, next) => {
    const auth = req.cookies;
    if(!auth.token) {
        return res.sendInvalidCred();
    }
    const token = auth.token
    jwt.verify(token, config.SECRET_KEY, async (error, credentials) => {
        try {
            let user = await User.findOne({ mail: credentials.mail });
            req.user = user;
            return next();
        } catch (error) {
            return res.sendInvalidCred();
        }
    })
}