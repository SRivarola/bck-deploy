import MyRouter from '../router.js';
import ProductsController from "../../controllers/products.controller.js";
import uploader from '../../services/uploader.js';
import update_delete_products from '../../middlewares/update_delete_products.js';
import { generateUniqueCode } from '../../uniqueCodeGenerator.js';

const productsController = new ProductsController();

export default class ProductRouter extends MyRouter {
    init() {
      this.post(
        "/",
        ["ADMIN", "PREMIUM"],
        uploader.single("file"),
        async (req, res, next) => {
          const { title, description, price, stock, code, status } = req.body;
          const file = req.file?.filename ? [req.file.filename] : [];
          const data = {
            title,
            description,
            price,
            stock,
            code,
            status,
            thumbnail: file,
          };
          data.owner = req.user._id;

          try {
            let product = await productsController.create(data);
            return res.sendSuccessCreate(product);
          } catch (error) {
            next(error);
          }
        }
      );

      this.read("/", ["PUBLIC"], async (req, res, next) => {
        const { title, page } = req.query;
        let products;
        try {
          if (title) {
            const lookfor = new RegExp(title, "i");
            products = await productsController.read(
              { title: lookfor },
              { lean: true, limit: 4, page: page ? page : 1 }
            );
          } else {
            products = await productsController.read(
              {},
              { lean: true, limit: 4, page: page ? page : 1 }
            );
          }
          return res.status(200).json({
            success: true,
            payload: products.response,
          });
        } catch (error) {
          next(error);
        }
      });

      this.read("/all", ["ADMIN", "PREMIUM"], async (req, res, next) => {
        try {
          const user = req.user;
          let response;
          if (user.role === "ADMIN") {
            response = await productsController.readAll();
          } else {
            response = await productsController.readAll({
              owner: user._id,
            });
          }

          response ? res.sendSuccess(response) : res.sendNotFound();
        } catch (error) {
          next(error);
        }
      });

      this.read("/:pid", ["PUBLIC"], async (req, res, next) => {
        try {
          let { pid } = req.params;
          let product = await productsController.readOne(pid);
          if (product) {
            return res.sendSuccess(product);
          } else {
            return res.sendNotFound();
          }
        } catch (error) {
          next(error);
        }
      });

      this.put(
        "/:pid",
        ["ADMIN", "PREMIUM"],
        update_delete_products,
        uploader.single("file"),
        async (req, res, next) => {
          try {
            let { pid } = req.params;
            let { title, description, price, stock, quantity } = req.body;
            const file = req.file?.filename ? [req.file.filename] : null;
            let data = {};

            let product = await productsController.readOne(pid);

            if (title) data.title = title;
            if (description) data.description = description;
            if (price) data.price = price;
            if (stock) data.stock = stock;
            if (file) data.thumbnail = file;
            if (quantity)
              data.stock = product.response.stock - Number(quantity);

            let response = await productsController.update(pid, data);

            return response ? res.sendSuccess(response) : res.sendNotFound();
          } catch (error) {
            next(error);
          }
        }
      );

      this.delete(
        "/:pid",
        ["ADMIN", "PREMIUM"],
        update_delete_products,
        async (req, res, next) => {
          try {
            let { pid } = req.params;
            let product = await productsController.delete(pid);
            if (product) {
              return res.sendSuccess(product);
            } else {
              return res.sendNotFound();
            }
          } catch (error) {
            next(error);
          }
        }
      );

      //artillery
      this.post(
        "/fake/create",
        ["ADMIN", "PREMIUM", "PUBLIC"],
        async (req, res, next) => {
          let code = generateUniqueCode();
          console.log(code);
          let data = {
            title: "Producto Prueba",
            description: "Producto Prueba",
            price: 99999,
            stock: 88888,
            code: code,
            status: true,
            thumbnail: ["productoTest.png"],
          };

          try {
            let product = await productsController.create(data);
            return res.sendSuccessCreate(product);
          } catch (error) {
            next(error);
          }
        }
      );

      this.delete(
        "/fake/:pid",
        ["ADMIN", "PREMIUM", "PUBLIC"],
        async (req, res, next) => {
          try {
            let { pid } = req.params;
            let product = await productsController.delete(pid);
            if (product) {
              return res.sendSuccess(product);
            } else {
              return res.sendNotFound();
            }
          } catch (error) {
            next(error);
          }
        }
      );
      
    };
}
