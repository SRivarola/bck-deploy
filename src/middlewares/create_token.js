import jwt from "jsonwebtoken";
import env from "../config/env.js";

export default function (req, res, next) {
    let token = jwt.sign(
        { mail: req.body.mail },
        `${env.SECRET_KEY}`,
        { expiresIn: 60*60*24*7 }
    );
    req.session.token = token;
    return next();
}