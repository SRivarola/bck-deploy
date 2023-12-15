import AuthController from "../controllers/users.controller.js";

export default async function (req, res, next) {
    try {
        const controller = new AuthController()
        const { token } = req.body;
        
        const user = await controller.findOne({
          resetToken: token,
          resetTokenExpiresAt: { $gt: new Date() },
        });
        
        if (!user) {
          return res.sendNotFound();
        }
        
        req.user = user;
        return next();
        
    } catch (error) {
        next(error);
    }
}
