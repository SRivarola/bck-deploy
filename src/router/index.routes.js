import MyRouter from "./router.js";
import AuthRouter from "./routes/auth.routes.js";
import { authGithub } from "./routes/auth.routes.js";
import CartsRouter from "./routes/carts.routes.js";
import ProductRouter from "./routes/products.routes.js";
import OrdersRouter from "./routes/orders.routes.js";
import LoggersRoute from "./routes/loggers.routes.js";
import mailsController from '../controllers/mails.controller.js';
import PaymentsRouter from "./routes/payments.routes.js";

const auth = new AuthRouter();
const product = new ProductRouter();
const cart = new CartsRouter();
const order = new OrdersRouter();
const logger = new LoggersRoute();
const payments = new PaymentsRouter()

export default class IndexRouter extends MyRouter {
    init() {
        this.read('/', (req, res) => res.status(200).send('products store api'));
        this.use('/auth', auth.getRouter());
        this.use("/auth", authGithub);
        this.use('/products', product.getRouter());
        this.use('/carts', cart.getRouter());
        this.use('/tickets', order.getRouter());
        this.use('/loggers', logger.getRouter());
        this.use('/payments', payments.getRouter());
        this.post('/mail', ["USER"], mailsController);
        this.read('/simple',["PUBLIC"], (req, res) => {
            let total = 1;
            for (let i = 1; i < 100; i++) {
                total = i * i;
            }
            return res.sendSuccess({total}); 
        })
        this.read('/complex',["PUBLIC"], (req, res) => {
            let total = 1;
            for (let i = 1; i < 10000000000; i++) {
                total = i * i;
            }
            return res.sendSuccess({total}); 
        })
    }
}