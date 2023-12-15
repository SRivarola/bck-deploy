import ProductsRepository from "../repositories/products.rep.js";

export default class ProductsService {
    constructor() {
        this.repository = new ProductsRepository();
    }
    create = (data) => this.repository.create(data);
    read = (query, data) => this.repository.read(query, data);
    readAll = (data) => this.repository.readAll(data);
    readOne = (id) => this.repository.readOne(id);
    update = (id, data) => this.repository.update(id, data);
    delete = (id) => this.repository.delete(id);
}