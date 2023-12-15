import dao from '../dao/factory.js';

const { Product } = dao;

export default class ProductsRepository {
    constructor() {
        this.model = new Product();
    }
    create = (data) => this.model.create(data);
    read = (query, data) => this.model.read(query, data);
    readAll = (data) => this.model.readAll(data);
    readOne = (id) => this.model.readOne(id);
    update = (id, data) => this.model.update(id, data);
    delete = (id) => this.model.delete(id);
}