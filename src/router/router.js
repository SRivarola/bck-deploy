import { Router} from 'express'
import jwt from 'jsonwebtoken'
import User from '../dao/mongo/models/user.js'
import env from '../config/env.js';
import MyError from '../config/MyError.js';
import errors from '../config/errors.js';

export default class MyRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    getRouter() {
        return this.router
    }
    init() {}
    applyCbs(cbs) {
        return cbs.map((cb) => async (...params) => {
            try {
                await cb.apply(this, params);
            } catch (error) {
                params[1].status(500).send(error);
            }
        })
    }
    responses = (req, res, next) => {
        res.sendSuccessCreate = (payload) => res.status(201).json(payload);
        res.sendSuccess = (payload) => res.status(200).json(payload);
        res.sendFailed = () => MyError.newError(errors.failed);
        res.sendNoAuth = () => MyError.newError(errors.auth);
        res.sendInvalidCred = () => MyError.newError(errors.credentials);
        res.sendForbidden = () => res.status(403).json({ status: 'Error', message: 'Unauthorized'});
        res.sendNotFound = (payload) => MyError.newError(errors.notFound(payload) );
        return next()
    }
    handlePolicies = (policies) => async (req, res, next) => {
        if (policies.includes('PUBLIC')) {
            return next()
        } else {
            const token = req.cookies.token;
            if(!token) {
                return res.sendForbidden();
            } else {
                const payload = jwt.verify(token, env.SECRET_KEY)
                const user = await User.findOne(
                    { mail: payload.mail },
                    'mail role'
                )
                const role = user.role;
                if (
                    (policies.includes("USER") && role === "USER") ||
                    (policies.includes("PREMIUM") && role === "PREMIUM") ||
                    (policies.includes("ADMIN") && role === "ADMIN")
                ) {
                    req.user = user
                    return next()
                } else {
                    return res.sendInvalidCred();
                }
            }
        }
    }
    //create
    post(path, policies, ...cbs) {
        this.router.post(
            path,
            this.responses,
            this.handlePolicies(policies),
            this.applyCbs(cbs)
        )
    }
    //read
    read(path, policies, ...cbs) {
        this.router.get(
            path,
            this.responses,
            this.handlePolicies(policies),
            this.applyCbs(cbs)
        )
    }
    //update
    put(path, policies, ...cbs) {
        this.router.put(
            path,
            this.responses,
            this.handlePolicies(policies),
            this.applyCbs(cbs)
        )
    }
    //delete
    delete(path, policies, ...cbs) {
        this.router.delete(
            path,
            this.responses,
            this.handlePolicies(policies),
            this.applyCbs(cbs)
        )
    }
    // use
    use(path, ...cbs){
        this.router.use(
            path, 
            this.responses,
            this.applyCbs(cbs)
        )
    }
}