import dao from '../dao/factory.js';
const { Order } = dao;

export default class OrdersRepository {
    constructor() {
        this.model = new Order();
    }
    
    create = (data) =>  this.model.create(data);
    readOne = (id) =>  this.model.readOne(id);
    readAll = (page) =>  this.model.readAll(page);
    readByUser = (mail) =>  this.model.readByUser(mail);
    //readAllTickets = (user_id) =>  this.model.readAllTickets(user_id);
}
