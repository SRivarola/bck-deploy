import { createTransport } from "nodemailer";
import command from './arguments.js';
import env from './env.js';
const { G_MAIL, G_PASS } = env

const port = process.env.PORT || command.p;

export default createTransport({
    service: "gmail",
    port,
    auth: {
        user: G_MAIL,
        pass: G_PASS
    }
});