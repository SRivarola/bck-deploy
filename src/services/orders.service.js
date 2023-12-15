import OrdersRepository from "../repositories/orders.rep.js";

export default class OrdersService {
    constructor() {
        this.repository = new OrdersRepository();
    }
    
    create = (data) =>  this.repository.create(data);
    readOne = (id) =>  this.repository.readOne(id);
    readAll = (page) =>  this.repository.readAll(page);
    readByUser = (mail) =>  this.repository.readByUser(mail);
    //readAllTickets = (user_id) =>  this.repository.readAllTickets(user_id);
}
