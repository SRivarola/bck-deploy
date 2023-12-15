import ProductsController from "../controllers/products.controller.js";

export default async function (req, res, next) {
    try {
        if(req.user.role === 'PREMIUM') {
            const controller = new ProductsController()
            const data = req.body;
            const product = await controller.readOne(data.product_id)
            if(product.response && product.response.owner && product.response.owner.toLocaleString() === req.user._id.toLocaleString()) {
                return res.sendForbidden();
            }
        }
        return next();
    } catch (error) {
        next(error)
    }
}