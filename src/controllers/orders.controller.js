import OrdersService from "../services/orders.service.js";

export default class OrdersController {
    constructor() {
        this.service = new OrdersService();
    }
    
    create = (data) =>  this.service.create(data);
    readOne = (id) =>  this.service.readOne(id);
    readAll = (page) =>  this.service.readAll(page);
    readByUser = (mail) =>  this.service.readByUser(mail);
    //readAllTickets = (user_id) =>  this.service.readAllTickets(user_id);
}