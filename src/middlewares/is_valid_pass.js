import bcrypt from "bcryptjs";
import User from "../dao/mongo/models/user.js";

export default async function(req, res, next) {
    let password_from_form = req.body.password
    let user = await User.findOne({ mail: req.body.mail })
    let password_hash = user.password

    let verified = bcrypt.compareSync(password_from_form, password_hash)
    if(verified){
        return next()
    } else {
        return res.sendInvalidCred();
    }
}