import passport from 'passport';
import { Strategy } from "passport-local";
import GhStrategy from "passport-github2";
import User from "../dao/mongo/models/user.js";
import jwt from 'passport-jwt';
import env from '../config/env.js';

export default function () {
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        return done(null, user);
    })
    
    passport.use(
        'current',
        new jwt.Strategy(
            {
                jwtFromRequest: jwt.ExtractJwt.fromExtractors([
                    (req) => req?.cookies.token,
                ]),
                secretOrKey: env.SECRET_KEY,
            },
            async (payload, done) => {
                try {
                    let user = await User.findOne({ mail: payload.mail });
                    if(user) {
                        done(null, user)
                    } else {
                        done(null)
                    }
                } catch (error) {
                    done(error)
                }
            }
        )
    )
    
    passport.use(
        'github',
        new GhStrategy(
            {
                clientID: process.env.GH_CLIENT_ID,
                clientSecret: process.env.GH_CLIENT_SECRET,
                callbackURL: process.env.GH_CB
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ mail: profile._json.email })
                    if(user){
                        return done(null, user)
                    } else {
                        const name = profile._json.name.split(' ');

                        let one = await User.create({
                          first_name: name[0],
                          last_name: name[1],
                          photo: profile._json.avatar_url,
                          mail: profile._json.email,
                          password: profile._json.profileUrl,
                        });
                        return done(null, one)
                    }
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}