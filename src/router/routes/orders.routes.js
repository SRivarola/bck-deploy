import MyRouter from '../router.js';
import OrdersController from "../../controllers/orders.controller.js";
import CartsController from '../../controllers/carts.controller.js';
import { v4 as uuidv4 } from 'uuid';

const controller = new OrdersController();
const cartsController = new CartsController();

export default class OrdersRouter extends MyRouter {
    init() {
        this.post(
            '/',
            ["USER", "PREMIUM"],
            async (req, res, next) => {
                try {
                    let user = req.user;
                    let total = await cartsController.getTotal(user._id);
                    let data = {
                        amount: total.response[0].total,
                        code: uuidv4(),
                        purchaser: user.mail
                    }
                    let order = await controller.create(data)
                    order ? res.sendSuccessCreate(order) : res.sendNotFound('order');
                } catch (error) {
                    next(error);
                }
            }
        )

        this.read(
          "/",
          ["USER", "PREMIUM"],
          async (req, res, next) => {
            try {
              let mail = req.user.mail;
              let response = await controller.readByUser(mail);
              response ? res.sendSuccess(response) : res.sendNotFound("orders");
            } catch (error) {
              next(error);
            }
          }
        );

        this.read(
            "/:oid",
            ["USER", "PREMIUM"],
            async (req, res, next) => {
                try {
                    const { oid } = req.params;
                    let response = await controller.readOne(oid)
                    return response
                      ? res.sendSuccess(response)
                      : res.sendNotFound("order");
                } catch (error) {
                    next(error);
                }
            }
        )

        this.read(
            '/all',
            ["ADMIN"],
            async (req, res, next) => {
                try {
                    let page = req.body.page ? req.body.page : 1
                    let order = await controller.readAll(page);
                    order ? res.sendSuccess(order) : res.sendNotFound('order');
                } catch (error) {
                    next(error);
                }
            }
        );
        
    }
}
