import CartsService from "../services/cart.service.js";

export default class CartsController {
  constructor() {
    this.service = new CartsService();
  }
  create = (data) => this.service.create(data);
  readByUser = (query, data) => this.service.readByUser(query, data);
  readAllByUser = (id, state) => this.service.readAllByUser(id, state);
  update = (id, data) => this.service.update(id, data);
  delete = (id) => this.service.delete(id);
  deleteAll = (user_id) => this.service.deleteAll(user_id);
  getTotal = (id) => this.service.getTotal(id);
}