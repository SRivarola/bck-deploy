import ProductsController from "../controllers/products.controller.js";

export default async function (req, res, next) {
    try {
        if(req.user.role === "ADMIN") {
            return next();
        }
        if(req.user.role === "PREMIUM") {
            
            let { quantity } = req.body;
            if(quantity) return next();

            const controller = new ProductsController()
            const { pid } = req.params;
            const product = await controller.readOne(pid);
            if((product.response.owner?.toLocaleString() === req.user._id.toLocaleString())){
                return next();
            }
        }
        return res.sendForbidden()
    } catch (error) {
        next(error);
    }
}