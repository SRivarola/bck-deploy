import MyRouter from "../router.js";
import AuthController from "../../controllers/users.controller.js"
import passport from "passport";
import { Router } from "express";
import is_user from "../../middlewares/is_user.js";
import is_form_ok from '../../middlewares/is_form_ok.js';
import is_8_char from '../../middlewares/is_8_char.js';
import create_token from '../../middlewares/create_token.js';
import is_valid_pass from "../../middlewares/is_valid_pass.js";
import is_valid_user from "../../middlewares/is_valid_user.js";
import sent_pass_reset_email from "../../middlewares/sent_pass_reset_email.js";
import is_valid_resetpass_token from "../../middlewares/is_valid_resetpass_token.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";

const controller = new AuthController();

export default class AuthRouter extends MyRouter {
    init() {
        this.post(
            '/register', 
            ["PUBLIC"], 
            is_8_char,
            is_form_ok,
            is_valid_user,
            async (req, res, next) => {
                try {
                    let response = await controller.register(req.body)
                    return response ? res.sendSuccessCreate(response) : res.sendNotFound('user');
                } catch (error) {
                    next(error)
                }
            }
        )

        this.post(
            '/login', 
            ["PUBLIC"],
            is_user,
            is_valid_pass, 
            create_token, 
            async (req, res, next) => {
                try {
                    req.session.mail = req.body.mail
                    req.session.role = req.user.role
                    let response = await controller.login()
                    return response
                      ? res
                          .cookie("token", req.session.token, {
                            maxAge: 60 * 60 * 24 * 7 * 1000,
                            httpOnly: true,
                          })
                          .sendSuccess({
                            response,
                            user: { mail: req.session.mail, role: req.user.role },
                          })
                      : res.sendNotFound("user");
                } catch (error) {
                    next(error)
                }
            }
        )

        this.post(
            '/signout', 
            ["USER", "ADMIN", "PREMIUM"], 
            async (req, res, next) => {
                try {
                    req.session.destroy()
                    let response = await controller.signout();
                    return response ? res.clearCookie('token').sendSuccess(response) : res.clearCookie('token').sendNotFound('user');
                } catch (error) {
                    error.where = 'signout router'
                    return next(error);
                }
        })

        this.post(
          "/forgot-password",
          ["PUBLIC"],
          is_user,
          sent_pass_reset_email,
          async (req, res, next) => {
            try {
                return res.status(200).json({
                    message:
                    "Correo electrónico enviado para restablecimiendo de contraseña",
                });
            } catch (error) {
              next(error);
            }
          }
        );
        
        this.read(
            "/current",
            ["PUBLIC"],
            passport.authenticate("current"),
            async (req, res, next) => {
                let { mail, role, photo, first_name, last_name, _id } = req.user;
                try {
                    return res.status(200).json({
                      success: true,
                      user: { mail, role, photo, first_name, last_name, _id },
                    });
                } catch (error) {
                    next(error);
                }
            }
        );

        this.put(
            '/premium/:uid', 
            ["USER"],
            async (req, res, next) => {
                const { uid } = req.params; 
                try {
                    const response = await controller.update(uid, { role: "PREMIUM"})
                    const result = response.response
                    const { first_name, last_name, role, mail, _id, photo } = result;
                    
                    return response
                      ? res.sendSuccess({
                          first_name,
                          last_name,
                          role,
                          mail,
                          _id,
                          photo
                        })
                      : res.sendNotFound();
                } catch (error) {
                    next(error)
                    
                }    
            }
        );
        this.put(
            '/admin/:uid', 
            ["PREMIUM", "ADMIN"],
            async (req, res, next) => {
                const { uid } = req.params; 
                try {
                    const response = await controller.update(uid, { role: "ADMIN"})
                    const result = response.response
                    const { first_name, last_name, role, mail, _id, photo } = result;

                    return response
                      ? res.sendSuccess({
                          first_name,
                          last_name,
                          role,
                          mail,
                          _id,
                          photo
                        })
                      : res.sendNotFound();
                } catch (error) {
                    next(error)
                    
                }    
            }
        );

        this.put(
          "/reset_pass",
          ["PUBLIC"],
          is_valid_resetpass_token,
          is_8_char,       
          async (req, res, next) => {
            const { password } = req.body;
            const hashpass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            
            const response = await controller.update(req.user._id, {
              password: hashpass,
            });
            
            return res.status(200).json({ message: "Token válido" });
          }
        );
        

        this.delete(
            '/:uid',
            ["ADMIN"],
            async (req, res, next) => {
                try {
                    let { uid } = req.params;
                    let user = await controller.delete(uid);
                    return user ? res.sendSuccess(user) : res.sendNotFound('user');
                } catch (error) {
                    next(error)
                }
            });

            //ARTILLERY
            this.post(
                "/fake/login",
                ["PUBLIC"],
                create_token,
                async (req, res, next) => {
                try {
                    let data = {
                    mail: "testperformance@coder.com",
                    password: "Test1234",
                    role: "ADMIN",
                    };
                    let response = await controller.login(data);
                    return response
                    ? res
                        .cookie("token", req.session.token, {
                            maxAge: 60 * 60 * 24 * 7 * 1000,
                            httpOnly: true,
                        })
                        .sendSuccess({
                            response,
                        })
                    : res.sendNotFound("user");
                } catch (error) {
                    next(error);
                }
                }
            );

            this.post(
                "/fake/signout",
                ["PUBLIC"],
                async (req, res, next) => {
                try {
                    req.session.destroy();
                    let response = await controller.signout();
                    return response
                    ? res.clearCookie("token").sendSuccess(response)
                    : res.clearCookie("token").sendNotFound("user");
                } catch (error) {
                    error.where = "signout router";
                    return next(error);
                }
                }
            );
            
    }
}


export const authGithub = Router();

authGithub.get(
    "/github",
    passport.authenticate("github", { scope: ["user:mail"] }),
    (req, res) => {}
);

authGithub.get(
    "/github/callback",
    passport.authenticate("github", {}),
    (req, res, next) => {
    try {
        req.session.mail = req.user.mail;
        req.session.role = req.user.role;
        let token = jwt.sign(
            { mail: req.session.mail }, 
            `${env.SECRET_KEY}`, 
            {expiresIn: 60 * 60 * 24 * 7}
        );
        req.session.token = token
        return res
            .status(200)
            .cookie('token', token)
            .redirect("http://localhost:5173/products");
    } catch (error) {
        next(error);
    }
    }
);

authGithub.get(
    '/github/token',
    async (req, res, next) => {
        try {
            const user = await JSON.parse(req.cookies.git_token);
            
            if(user){
                return res.sendSuccess(user);
            }
            return res.sendNotFound()
        } catch (error) {
            next(error);
        }
    }
)
