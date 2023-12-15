import Product from "./models/products.js";

export default class ProductMongo {
    constructor() {}
    async create(data) {
        let product = await Product.create(data);
        return {
            message:"Product created",
            response: product._id
        };
    };
    async read(query, data) {
        let all = await Product.paginate(query, data)
        if(all.docs.length > 0) {
            return {
                message: "Products found",
                response: all
            }
        } else {
            return null
        }
    }
    async readOne(id) {
        let one = await Product.findById(id);
        if(one){
            return {
                message: "Product found",
                response: one
            };
        } else {
            return null;
        };
    };
    async readAll(data) {
        let one = await Product.find(data);
        if(one){
            return {
                message: "Products found",
                response: one
            };
        } else {
            return null;
        };
    };
    async update(id, data) {
        let one = await Product.findByIdAndUpdate(id, data, { new: true });
        if(one){
            return {
                message: "Product updated!",
                response: one
            };
        } else {
            return null;
        };
    };
    async delete(id) {
        let one = await Product.findByIdAndDelete(id);
        if(one) {
            return {
                message: "Product deleted",
                response: one
            };
        } else {
            return null;
        };
    };
}