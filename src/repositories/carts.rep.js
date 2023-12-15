import dao from '../dao/factory.js';
const { Cart } = dao;

export default class CartsRepository {
  constructor() {
    this.model = new Cart();
  }
  create = (data) => this.model.create(data);
  readByUser = (query, data) => this.model.readByUser(query, data);
  readAllByUser = (id, state) => this.model.readAllByUser(id, state);
  update = (id, data) => this.model.update(id, data);
  delete = (id) => this.model.delete(id);
  deleteAll = (user_id) => this.model.deleteAll(user_id);
  getTotal = (id) => this.model.getTotal(id);
}