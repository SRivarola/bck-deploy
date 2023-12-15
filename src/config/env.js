import dotenv from "dotenv";
import command from "./arguments.js";

const environment = command.mode;
const path = environment === "dev" ? "./.env.dev" : "./.env.prod";
dotenv.config({ path });

export default {
    LINK_MDB: process.env.LINK_MDB,
    SECRET_COOKIE: process.env.SECRET_COOKIE,
    SECRET_SESSION: process.env.SECRET_SESSION,
    SECRET_KEY: process.env.SECRET_KEY,
    G_MAIL: process.env.G_MAIL,
    G_PASS: process.env.G_PASS,
    BASE_URL: process.env.BASE_URL,
    STRIPE_KEY: process.env.STRIPE_KEY,
};