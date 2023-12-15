import MyRouter from '../router.js';
import CartsController from '../../controllers/carts.controller.js';
import ProductsController from '../../controllers/products.controller.js';
import cart_user_role from '../../middlewares/cart_user_role.js';

const controller = new CartsController();
const productsController = new ProductsController();

export default class CartsRouter extends MyRouter {
    init() {
        this.post(
            '/', 
            ["USER", "PREMIUM"],
            cart_user_role,
            async (req, res, next) => {
                try {
                    let user = req.user;
                    let data = req.body;
                    let product = await productsController.readOne(data.product_id);
                    data.user_id = user._id;
                    data.price = product.response.price;
                    let oldCart = await controller.readAllByUser(user._id, "pending");
                    let response;

                    if(!oldCart) {
                      response = await controller.create(data);
                    } else {
                      const filteredCart = oldCart.response.find( item => item.product_id._id.toString() == product.response._id.toString() );
                      if(!filteredCart) {
                        response = await controller.create(data);
                      } else {
                        response = await controller.update(filteredCart._id, { quantity: filteredCart.quantity + data.quantity });
                      }
                    }
                    return res.sendSuccessCreate(response); 
                } catch (error) {
                    next(error)
                }
            }
        )
        this.read(
            '/', 
            ["USER", "PREMIUM"],
            async (req, res, next) => {
                try {
                  let user_id = req.user._id;
                  let state = "pending";
                  if (req.query.state) {
                    state = req.query.state;
                  }
                  let response = await controller.readByUser(
                    { user_id, state },
                    {
                      populate: [
                        {
                          path: "user_id",
                          select: "first_name last_name mail photo",
                        },
                        {
                          path: "product_id",
                          select: "-createdAt -updatedAt -__v"
                        }
                      ],
                      lean: true,
                      limit: 10,
                    }
                  );

                  response
                    ? res.sendSuccess(response)
                    : res.sendNotFound("cart");
                } catch (error) {
                    next(error);
                }
            }
        )

        this.read(
          "/all",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              let user_id = req.user._id;
              let state = "pending";
              if (req.query.state) {
                state = req.query.state;
              }
              let response = await controller.readAllByUser(user_id, state);

              response
                ? res.sendSuccess(response)
                : res.sendNotFound("cart");
            } catch (error) {
              next(error);
            }
          }
        );

        this.read(
          "/total",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              let id = req.user._id;
              let total = await controller.getTotal(id);
              total ? res.sendSuccess(total) : res.sendNotFound(0);
            } catch (error) {
              next(error);
            }
          }
        );

        this.put(
          "/:cid",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              let cart_id = req.params.cid;
              let data = req.body;
              let response = await controller.update(cart_id, data);
              response
                ? res.sendSuccess(response)
                : res.sendNotFound("product in cart");
            } catch (error) {
              next(error);
            }
          }
        );

        this.delete(
          "/:cid",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              let cart_id = req.params.cid;
              let response = await controller.delete(cart_id);
              response ? res.sendSuccess(response) : res.sendNotFound("cart");
            } catch (error) {
              next(error);
            }
          }
        );

        this.delete(
          "/",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              console.log('borrar carrito')
              let user = req.user;
              let response = await controller.deleteAll(user._id);
              console.log(response)
              response ? res.sendSuccess(response) : res.sendNotFound("cart");
            } catch (error) {
              next(error);
            }
          }
        );
    }
}