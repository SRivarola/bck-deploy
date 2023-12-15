import CartsRepository from "../repositories/carts.rep.js";

export default class CartsService {
  constructor() {
    this.repository = new CartsRepository();
  }
  create = (data) => this.repository.create(data);
  readByUser = (query, data) => this.repository.readByUser(query, data);
  readAllByUser = (id, state) => this.repository.readAllByUser(id, state);
  update = (id, data) => this.repository.update(id, data);
  delete = (id) => this.repository.delete(id);
  deleteAll = (user_id) => this.repository.deleteAll(user_id);
  getTotal = (id) => this.repository.getTotal(id);
}