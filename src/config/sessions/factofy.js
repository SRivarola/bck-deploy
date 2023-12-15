import args from "../arguments.js";
import expressSession from "express-session";
import sessionFileStore from "session-file-store";
import MongoStore from "connect-mongo";
import env from "../env.js";

let sessions = null;

switch(args.persistence) {
    case "FS":
        const FileStore = sessionFileStore(expressSession)
        sessions = expressSession({
            store: new FileStore({
                path: "./src/config/sessions/files/",
                ttl: 60 * 60 * 24 * 7,
                retries: 0
            }),
            secret: env.SECRET_SESSION,
            resave: true,
            saveUninitialized: true
        }) 
        break;
    default: //MONGO
        sessions = expressSession({
            store: MongoStore.create({
                mongoUrl: env.LINK_MDB,
                ttl:60*60*24*7
            }),
            secret: env.SECRET_SESSION,
            resave: true,
            saveUninitialized: false
        })
        break;
}

export default sessions;