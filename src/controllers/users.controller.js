import AuthService from '../services/users.service.js';

export default class AuthController {
    constructor() {
        this.service = new AuthService();
    }
    register = (data) => this.service.register(data);
    login = () => this.service.login();
    signout = () => this.service.signout();
    readOne = (mail) => this.service.readOne(mail);
    readById = (id) => this.service.readById(id);
    update = (id, data) => this.service.update(id, data);
    delete = (id) => this.service.delete(id);
    saveResetToken = (user_id, token, expiresIn) => this.service.saveResetToken(user_id, token, expiresIn);
    findOne = (query) => this.service.findOne(query);
}