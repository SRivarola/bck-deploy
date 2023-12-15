import User from "../dao/models/user.js";
import jwt from "jsonwebtoken";

export default function (req, res, next) {
    const auth = req.session.token;
    if(!auth) {
        return res.sendInvalidCred();
    }
    const token = auth;
    jwt.verify(token, `${process.env.SECRET_KEY}`, async (error, credentials) => {
        try {
            let user = await User.findOne({ mail: credentials.mail })
            req.user = user;
            return next()
        } catch (error) {
            return res.sendInvalidCred();
        }
    })
}