import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import compression from 'express-compression';
import env from "./config/env.js";
import __dirname from './utils.js';
import sessions from './config/sessions/factofy.js';
import winston from './middlewares/winston.js';
import errorHandler from './middlewares/errorHandler.js'
import notFoundHandler from './middlewares/notFoundHandler.js';
import inicializePassport from './middlewares/passport.js';
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import options from "./config/swagger.js";

import IndexRouter from './router/index.routes.js';
const router = new IndexRouter()

const app = express();
const specs = swaggerJSDoc(options);

app.use(cookieParser(env.SECRET_COOKIE))
app.use(sessions)
inicializePassport();
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors())
app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})
app.use(winston);
app.use(express.static((`${__dirname}/public`)))
app.use(express.urlencoded({extended: true}));
app.use(
    compression({
        brotli: { enable: true, zlib: {} }
    })
); 
app.use("/api/docs", serve, setup(specs))
app.use('/api', router.getRouter())
    
app.use(errorHandler)
app.use(notFoundHandler)

export default app;