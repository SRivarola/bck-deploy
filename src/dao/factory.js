import args from "../config/arguments.js";
import MongoConnect from "../config/mongo.js";
import env from "../config/env.js";

let dao = {};

switch (args.persistence) {
    case "FS":
        console.log("file system: connected");
        const { default: ProductManager } = await import('./manager/ProductManager.js');
        const { default: UserManager } = await import('./manager/UserManager.js');
        dao = { Product: ProductManager, User: UserManager };
        break;
    default: //MONGO
        const mongo = new MongoConnect(env.LINK_MDB);
        mongo.connect_mongo();
        const { default: ProductMongo } = await import('./mongo/products.mongo.js');
        const { default: UserMongo } = await import('./mongo/users.mongo.js');
        const { default: CartMongo } = await import('./mongo/carts.mongo.js');
        const { default: OrderMongo } = await import('./mongo/orders.mongo.js');
        dao = { Product: ProductMongo, User: UserMongo, Cart: CartMongo, Order: OrderMongo };
        break;
}

export default dao;