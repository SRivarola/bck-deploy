import ProductsService from "../services/products.service.js";

export default class ProductsController {
    constructor() {
        this.service = new ProductsService();
    }
    create = (data) => this.service.create(data);
    read = (query, data) => this.service.read(query, data);
    readAll = (data) => this.service.readAll(data);
    readOne = (id) =>  this.service.readOne(id);
    update = (id, data) => this.service.update(id, data);
    delete = (id) => this.service.delete(id);
}