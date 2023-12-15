import AuthRepository from '../repositories/users.rep.js';

export default class AuthService {
    constructor() {
        this.repository = new AuthRepository();
    }
    register = (data) => this.repository.register(data);
    login = () => this.repository.login();
    signout = () => this.repository.signout();
    readOne = (mail) => this.repository.readOne(mail);
    readById = (id) => this.repository.readById(id);
    update = (id, data) => this.repository.update(id, data);
    delete = (id) => this.repository.delete(id);
    saveResetToken = (user_id, token, expiresIn) => this.repository.saveResetToken(user_id, token, expiresIn);
    findOne = (query) => this.repository.findOne(query);
}