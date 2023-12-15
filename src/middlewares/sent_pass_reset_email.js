import transporter from "../config/transporter.js";
import { generateUniqueToken } from "../utilsFunctions.js";
import AuthRepository from "../repositories/users.rep.js";
import env from "../config/env.js";


const { G_MAIL } = env;

const authRepository = new AuthRepository();

export default async function (req, res, next) {
    try {
        const { mail } = req.body
        const user_id = req.user._id

        const token = generateUniqueToken();
        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        await authRepository.saveResetToken(user_id, token, expiresIn);

        const resetUrl = `http://localhost:5173/recover_pass/${token}`;
        const subject = "Password recovery";
        const html = `
        <h1>Password recovery</h1>
        <p>Click on the link below to reset your password: </p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1hr.</p>
        `;

        await transporter.sendMail({
            from: G_MAIL,
            to: mail,
            subject,
            html
        });

        return next();

    } catch(error) {
        throw error;
    }
}
